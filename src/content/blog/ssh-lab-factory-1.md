---
publishDate: 2023-11-04T00:00:00Z
title: Leveraging ContainerSSH to build a linux lab platform (ssh-lab-factory Part 1)
excerpt: Building a lightweight SSH container provisioning system for labs and interactive demos
tags:
  - containerSSH
  - docker
  - asciinema
  - ssh
  - ssh-lab-factory
  - blog
---

In my free time, I often assist the cybersecurity team [UMCST](https://umcst.maine.edu) of my alma mater university (University of Maine, Orono) in running practice competitions, and previously have assisted with labs and done interactive demos.

When I ran across the [containerSSH](https://containerssh.io/) I thought it could be fun to build some lightweight supporting microservices. My initial goal was to support multiple environments (multiple container configurations), and handle SSH authentication in some way that would minimize friction for users. I quickly came up with the idea for using a similar mechanism that is common to graphical linux installers - pull public keys from GitHub!

Thanks to the way containerSSH delegates authentication to a microservice, this is a relatively simple thing to achieve. Their documentation suggests you achieve this by leveraging a Golang library they've written for the purpose, but to me that seemed overkill for my simple plan. Their own `authconfig` [server implementation](https://github.com/ContainerSSH/examples/tree/2d749aa13939e5faf0e3f07a3a2936a5770f82d7/opa/containerssh) for testing purposes, however, used a Open Policy Agent server for the `authconfig` REST API, which seemed like a great solution to me.

It took some time for me to wrap my head around the way Rego worked, but soon I had a couple lines of Rego that did exactly what I needed:

```
package containerssh

import future.keywords.if

# we don't support password auth at all
auth.password.success := false

# default to denying pubkey auth
default auth.pubkey.success := false


# look up github keys and compare to the provided key
auth.pubkey.success if {

        # pull github keys from github
        github_keys := http.send({
                "method": "get",
                "url": concat(
                        "",
                        ["https://github.com/", input.username, ".keys"],
                )
        })

        # check if pubkey is in list from github
        input.publicKey in split(github_keys.raw_body, "\n")
}
```


This configuration servers as a great minimal POC, allowing a user to login via containerSSH if the username and SSH key provided matches one of the keys for that username in Github. In later posts, we will expand on this POC to add support for a user whitelist, and add a framework of microservices to dynamic configuration of arbitrary container configurations.