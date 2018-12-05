---
layout: post
title: Access from container to host
fbcomments: yes
tags: docker osx
---
`docker run` has a [networking configuration you can specify](https://docs.docker.com/engine/reference/run/#network-settings).
If you pass: `--network=host` the container will use the host network stack.

It doesn't work on OSX.
Whell, it actually does work, but you can't really use it.
Docker deamon on osx runs on a virtual machine, so passing `--network=host` use the VM network.

The simplest workaround I found is released in version [17.06 of docker-for-mac](https://docs.docker.com/docker-for-mac/release-notes/#docker-community-edition-17060-ce-mac18-2017-06-28-stable).
Just use `docker.for.mac.localhost` as the host name.

links:
* [SO](https://stackoverflow.com/a/44929258/142902)
* [Docker V17.06](https://docs.docker.com/docker-for-mac/release-notes/#docker-community-edition-17060-ce-mac18-2017-06-28-stable)
* [`docker run`](https://docs.docker.com/engine/reference/run/#network-settings)
