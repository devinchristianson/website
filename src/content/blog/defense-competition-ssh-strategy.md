---
publishDate: 2023-11-04T00:00:00Z
title: Potential alternative SSH stratedy for cyber defense competitions
excerpt: Dynamic SSH strategy for easier key rotation and minimal server reconfiguration 
tags:
  - ssh
  - blue-team
  - neccdc
  - ssh-lab-factory
  - blog
---
## Initial inspiration
During a defensive cybersecurity competition, maintaining security of SSH keys is of the utmost imperative. A common approach is using password-locked keys shared between blue team and deployed at the beginning of the competition, then rotated at least once during a two day competition. This is ineffective the task of rolling out SSH key requirements and the keys themselves is time consuming, as is rotating them once a better security posture is established. This compromises the effectiveness of the approach as it means keys deployed at the start of the competition before workstation security was established often remain in place later on, allowing for the potential for compromise by keyloggers or other methods.

## The AuthorizedKeysCommand approach
Short of the high-complexity alternative of implementing an SSH CA with just-in-time access and short certificate expiry times, an alternative approach would be to perform minimal SSH configuration enforcing SSH key usage, disabling local key files, and configuring a re-usable `AuthorizedKeysCommand` on all servers at the start of the competition. The `AuthorizedKeysCommand` directive calls the provided executable with the authenticating user as the single argument and expects authorized_keys style output if any keys are found. Using this directive would allow servers to pull authorized keys from a centralized, easily updated source, such as a web server or a DNS TXT record, perhaps in a manner that would allow falling back to alternative sources to avoid loss of access. This directive is more traditionally used to pull keys from some central store, such as via LDAP or Vault, or used to inject keys at runtime (such as by AWS to inject user-provided keys into instances), but a simpler, lighter-weight solution is sufficient for a competition environment. Whatever the command is, it should use CLI tools that are typically installed by default on most distributions, such as `curl` and `dig`.

## Simplifying configuration through precedence
Per the upstream `sshd_config` manual, for each keyword in the configuration file “Unless noted otherwise, for each keyword, the first obtained value will be used” (https://man.openbsd.org/sshd_config). This means that it should be possible to establish a baseline configuration across a number of distributions in a manner that requires little scripting, thus falling within the competition’s spirit and established rules. Debian-based distributions (and likely some others) take advantage of this behavior by using an `Include` directive at the top of the file, for easy configuration without modifying the main file, but this configuration is not standard across distributions, so it is likely more reliable to simply prepend `/etc/ssh/sshd_config` on all unix hosts. While this is not an ideal approach for a real-world environment as it is likely to cause confusion about what the actual live configuration is, it seems like a great way to save time during a defensive competition.

## Examples
Basic key script: `getkeys.sh`
```
#!/bin/bash
curl -s -f http://<workstation_ip>:8000 || dig -t txt +short <internal.domain> | tr -d '"'
```

Per the SSHD requirements, this script file must be:
```
chown root:nobody getkeys.sh
chmod 750 getkeys.sh
```

Prepend `/etc/ssh/sshd_config` with:
```
# the directive will pass the requested user as the first argument to the script but our script doesnt use it
AuthorizedKeysCommand /usr/local/bin/getkeys.sh
AuthorizedKeysCommandUser nobody
# disables all local files
AuthorizedKeysFile none
# set up server to require pubkey and disallow password
# could also configure this to require both pubkey AND password for login
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
# user whitelist
AllowUsers <list of expected users - do not include root>
```
