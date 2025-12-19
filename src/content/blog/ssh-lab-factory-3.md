---
publishDate: 2024-02-27T00:00:00Z
title: "Road to ssh-lab-factory version 0: POC of the first lab (Part 3)"
excerpt: 
tags:
  - containerSSH
  - docker
  - k3d
  - k3s
  - kubernetes
  - ssh
  - ssh-lab-factory
  - blog
---

In the previous posts, I laid out the reasons for a containerized SSH lab framework for CLI-based ephemeral lab environments. In this post, I will lay out the first use case for this framework, and the base requirements of the planned framework.

This year the collegiate cybersecurity team I assist has been trying to tackle learning Kubernetes, and I have discovered that frequently the first stumbling block to learning Kubernetes is simply setting up a functioning cluster, especially one with enough supporting infrastructure to practice the basics of Ingress and automating certificate management. 

In trying to help support their learning, I began looking for a way to set up small ephemeral clusters for the students so the students could experiment obtrusive guard rails/permission limitations, and without fear of interupting another student's environment. For this purpose, I explored pretty much every local development cluster tool out there - MiniKube, Kind, MicroK8s, K3d, you name it. As I tested out tools, I also developed a list of ideal criteria I would need for such a project:

1. Capable of managing multiple clusters on a single host
2. Leverages docker to run the kubernetes node (nested virtualization is clunky)
3. Must be cross-platform enough the students could also use it directly
4. Capable of some form of web ingress
5. Capable of multi-node clusters, should the need arise

In the end, there was only one tool that satisfied all requirements well: [k3d](https://k3d.io). It uses [k3s](https://k3s.io/) under the hood, and provisions the k3s nodes as docker containers. It is an amazing project, and I can't recommend it enough if you ever need a temporary cluster for local development, in a CI pipeline, or anywhere else.

Naturally, my plan was to use my still-in-early-planning `ssh-lab-factory` project to run these environments, with the basic usage flow from the student perspective as follows:
1. SSH to the lab host using Github SSH key
2. K3s cluster is automatically created+started on SSH connection
3. Lab resources + required tools are already present within the container
4. On logout, the cluster is paused to save on resources*

I also realized that thanks to [Traefik](https://traefik.io/traefik/)'s dynamic routing capabilities, with some clever labelling of the k3s containers via k3d, I could proxy HTTP traffic for `<username>.<lab_domain>` to the corresponding cluster's own Traefik instance, and perform TCP TLS pass-through on HTTPS traffic, meaning that Ingress and [Let's Encrypt](https://letsencrypt.org/) certificates would work out of the box on the lab clusters.

Now that I had the basic idea for my first lab, it was time to move on to throw together a proof of concept! This first attempt simply mounted the docker socket into the lab container directly, and using the k3d CLI directly, then ensuring the cluster was running on login thanks to some scripting in the `bashrc`, then attempted to stop the cluster on logout with `bash_logout`.

While this initial POC worked great - the cluster started up on login and stopped on logout (and could be resumed on subsequent logins), I quickly also quickly discovered it's limitations:
- Lab members could trivially manage other participant clusters
- If the SSH user is allowed root access, container escape is trivial thanks to docker socket access
- `bash_logout` is not a reliable method for environment cleanup:
    - The SSH client hangs on logout until the stop action is complete
    - The stop action can be easily `^C`'d
    - `bash_logout` is unreliable depending if an alternative access method is used (e.g. [VSCode Remote SSH](https://code.visualstudio.com/docs/remote/ssh))

Now the first to isolation/security concerns could likely have been mitigated satisfactorily for my purposes, as these labs are not intended to freely available or particularly hardened (for example, by restricting sudo commands to only allow managing the assigned cluster), but I knew limiting root access within the container would inevitably lead to users complaining that the CLI tool needed/wanted wasn't available, and I was really stuck on the idea that clusters should be reliably stopped when there were no active SSH sessions accessing the cluster. Now, in normal operation ContainerSSH stops the target container on SSH disconnect, so I tried to get around the limitations of `bash_logout` by wrapping container ENTRYPOINT to catch the stop signal and shut down the cluster before allowing the container to exit, but it turns out ContainerSSH simple `Remove`'s the container on disconnect, meaning the container only receives a SIGKILL, so no dice.

The obvious solution here is to move the cluster provisioning to a separate, authenticated microservice which has access to the Docker socket, and to use ContainerSSH to trigger cleanup activity, as it clearly monitors the status of the SSH sessions it is proxying. However, ContainerSSH does not currently support calling an external webhook on disconnect [#486](https://github.com/ContainerSSH/libcontainerssh/issues/486) so this approach was also going to involve doing some work on ContainerSSH.

With the information I learned from the POC, I began by laying out the main requirements for the k3d microservice:
- Ability to ensure a cluster is running, stop the cluster, delete the cluster, and retrieve the kubeconfig for the cluster
- Allow the lab user to manage only their own cluster

I also had a couple of new requirements for the auth-config service:
- Allow per-lab configuration templates with access to the current username & environment
- Ability to hit a per-lab `initialization` webhook on configuration
- New `cleanup` webhook that triggers a per-lab `cleanup` webhook

In the next part, I'll talk through how I went about satisfying these requirements, and the road bumps I ran into along the way.