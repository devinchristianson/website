---
publishDate: 2024-02-27T00:00:00Z
title: "Live streaming terminal sessions (ssh-lab-factory Part 2)"
excerpt: Multiplexed terminal session live streaming?
tags:
  - containerSSH
  - asciinema
  - ssh
  - ssh-lab-factory
  - blog
---

In the previous posts, I laid out the reasons for a containerized SSH lab framework for CLI-based ephemeral lab environments. Here I will discuss the small webapp I built to take full advantage of ContainerSSH's best party trick: recording sessions in the `asciinema` [format](https://containerssh.io/v0.5/reference/audit/#the-asciinema-format).

## Asciinema

[Asciinema](https://asciinema.org/) is a very cool project for recording and sharing terminal sessions in a text-based format that is low bandwidth and web-friendly. Typically a special recording tool is used to capture sessions as they happen, but ContainerSSH uses it's access to the SSH data stream to capture sessions as they happen. 

## The idea

Once I discovered this feature of ContainerSSH, I had an idea - what if I could make a small web service to stream all live ContainerSSH sessions concurrently, making it easier to do live demos, troubleshoot with lab participants, and allow the participants to learn from each other. Doing a bit of digging, the asciinema-player library already has [websocket support](https://github.com/asciinema/asciinema-player/blob/develop/src/driver/websocket.js), and ContainerSSH can be configured to write asciinema sessions out to disk as they happen, so all I needed was a custom webserver that picked up the files as they were created and streamed any new content over websockets.

## Implementation

In an attempt to keep the implementation small and simple, I wanted to use the existing Asciinema Websocket driver. The driver expected to recieve a stream of Asciinema v2 events over a raw Websocket which meant I needed to have a server that could handle having different handlers depending on the requested path (and couldn't use Socket.io w/ groups or similar). Since I was stuck writing way to much vanilla JS at work, I was on a Typescript kick at the time for personal projects and really wanted to write the full webapp stack in TS. As it turns out, these "requirements" eliminated a lot of my options right off the bat, and I ended up settling on [Express](https://expressjs.com/) with [Express-WS](https://github.com/HenningM/express-ws) thanks to it's first-class parameterized handlers, allowing different url paths to be used for simultaneous websockets.