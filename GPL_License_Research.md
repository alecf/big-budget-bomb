# GPL License That Prevents Hosting Code Without Sharing Changes

## Answer: GNU Affero General Public License (AGPL) v3

The GPL license you're referring to is the **GNU Affero General Public License (AGPL) version 3**. This license was specifically designed to address the "ASP loophole" in the regular GPL.

## The Problem It Solves

The regular GNU GPL v3 has a limitation: if someone modifies GPL-licensed code and hosts it on a server (without distributing the modified code), they are not required to share their modifications. This is because the GPL's copyleft requirements only trigger upon "distribution" of the software.

## How AGPL v3 Addresses This

The AGPL v3 adds a crucial requirement in **Section 13: Remote Network Interaction**:

> "If you modify the Program, your modified version must prominently offer all users interacting with it remotely through a computer network (if your version supports such interaction) an opportunity to receive the Corresponding Source of your version by providing access to the Corresponding Source from a network server at no charge."

## Key Features

- **Network Copyleft**: Extends copyleft requirements to network use
- **Source Code Requirement**: Anyone using your hosted modified software must have access to the source code
- **Prevents ASP Loophole**: Closes the Application Service Provider loophole found in regular GPL
- **Same Freedom**: Ensures users of hosted software have the same freedoms as users of distributed software

## Common Use Cases

Popular projects using AGPL v3 include:
- Grafana
- Mastodon
- Nextcloud Server

## Important Note

The AGPL v3 does not address Software as a Service Substitute (SaaSS) issues, which is a separate concern about user control over their computing.

## Summary

If you want to ensure that anyone hosting your modified code must share their changes with users, the **GNU Affero General Public License v3** is the appropriate license choice.