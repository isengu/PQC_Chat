# Post-Quantum Safe Messaging Application (PQC_Chat)

## Overview

This project is a secure messaging application designed to resist threats posed by quantum computing. It uses CRYSTALS-Kyber for post-quantum key exchange, AES-256 for symmetric encryption, and PeerJS for peer-to-peer communication. Together, these technologies ensure end-to-end security.

## Features

- Post-Quantum Key Exchange: Uses CRYSTALS-Kyber, selected by NIST, to provide resistance against quantum attacks.

- Symmetric Encryption: Utilizes AES-256, offering robust security even in the presence of quantum computers when proper key lengths are used.

- Peer-to-Peer Communication: Employs PeerJS for establishing direct connections using WebRTC.

## Usage

Launch the application on two devices or browsers, connect from one of them by providing the id of the other.
Send and receive secure, encrypted messages!

## Technical Details

### Key Exchange

CRYSTALS-Kyber establishes a shared secret between peers.

### Symmetric Encryption

AES-256 encrypts messages using a key derived from the shared secret with SHA-256.

### Communication

PeerJS facilitates real-time communication using WebRTC, ensuring low latency and scalability.

## References

- Tat-Thang Nguyen, Nhu-Quynh Luc and T. Dao. "Developing Secure Messaging Software using
Post-Quantum Cryptography." Engineering, Technology & Applied Science Research (2023).
https://doi.org/10.48084/etasr.6549
- https://github.com/dajiaji/crystals-kyber-js
- https://github.com/brix/crypto-js
- https://peerjs.com/
