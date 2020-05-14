# Making GlobalProtect minimally useful under Gnome

The Palo Alto GlobalProtect Linux client has many deficiencies. This is my attempt to make it minimally useful as a Gnome user.

First let me note that I developed this all under Fedora 32. I am not aware of anything that would break under another distro, but don't make any guarantees.

For a long time, my workplace allowed Linux clients to connect over IPSEC with VPNC, at first because there was no GlobalProtect Linux client. Since the Linux client has been out for a while, the IPSEC solution is finally being retired. This is unfortunate, since the GlobalProtect Linux client has the feel of software we had to put up with 20 years ago, not of something written to integrate into a modern Linux desktop. Here is my attempt to alleviate the worst shortcomings.

## Gnome Shell Extension

The two biggest issues that I have with the GlobalProtect Client are:

1. The UI provides no clean way to be launched other than opening up a command line and running 'globalprotect launch-ui'

2. It provides absolutely know way to know the status of the VPN connection within a DE, or even from the commandline. Am I still connected? Did I forget to connect? Who knows?

I use Gnome, so the first thing I did was look for a Gnome Shell Extension that fixed any of this. I found [globalprotect-indicator by fbuescher](https://extensions.gnome.org/extension/2407/globalprotect-indicator/) which solves 2, but not 1. (Note, there is also [GlobalProtect VPN by guyou31](https://extensions.gnome.org/extension/2796/globalprotect-vpn/) which might work for you, but was not useful for me since I need the GUI version since our implementation requires SSO with a SAML IDP). [globalprotect-indicator by fbuescher](https://extensions.gnome.org/extension/2407/globalprotect-indicator/) was an excellent starting point for my needs, so I modified it in two ways:

1. Display an 'x' when the VPN is not connected, so there is always an icon visible in the UI.
2. Bring up the UI when you click on the icon.

This gives me an easy way to both see the status, and start and stop the VPN from Gnome.

You can install the extension by going to [https://extensions.gnome.org/extension/3106/woogies-globalprotect-extension/](https://extensions.gnome.org/extension/3106/woogies-globalprotect-extension/).

## systemd path and service

The other problem I had was the GlobalProtect client overwrites /etc/resolv.conf with my work's DNS servers. This might be fine for many things, but we don't have split DNS so there is nothing these servers can resolve that the public internet cannot, but it breaks resolving things only my DNS knows about. So I wrote some systemd files to monitor /etc/resolv.conf for changes, and undo the changes if GlobalProtect overwrote it.
