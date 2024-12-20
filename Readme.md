
# PlugAndTel Second Use Case - Real-time Audio Processing System

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version >= 20.16.0)
- [NPM](https://www.npmjs.com/) (version >= 10.8.1)


## Installation

1. Clonez ce projet :
   ```bash
   git clone https://github.com/ton-utilisateur/PlugAndTel.git
   ```

2. Accédez au répertoire du projet :
   ```bash
   cd PlugAndTel
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

---

## Fonctionnement

1. Lancez l'application en exécutant la commande suivante :
   ```bash
   npm start
   ```

   Cette commande va démarrer le serveur et le client en parallèle.

2. Voici ce que vous allez voir : à droite le côté serveur et à gauche le côté client :

![Client en fonctionnement](./assets/Server-client(cmd).jpg)
 
## Comment ça marche :
1-Parler pour commencer l'enregistrement

2-Visualisation du transfert (côté serveur)

3-Un silence de 3 secondes ou une interruption arrête l'enregistrement et génère un fichier .wav dans ./audio.

4-Le fichier audio généré peut être écouté depuis le répertoire ./audio

---

## Structure des fichiers

Voici un aperçu de la structure des fichiers de l'application :

```plaintext
PlugAndTel/
│
├── client/
│   └── audioStreamer.js         # Gère l'enregistrement et l'envoi de l'audio au serveur
│
├── server/
│   └── audioProcessor.js        # Gère la réception et le traitement de l'audio
│
├── logService/     
│       └── logs/
│           ├── client.log      # Log des actions du client
│           └── server.log      # Log des actions du serveur
│   └── ServerLogger.js          # Logs du serveur
│   └── clientLogger.js          # Logs du client
│
└── package.json                 # Dépendances et scripts du projet
```

---

## Logs

Les logs sont gérés via la bibliothèque **Winston**. Les fichiers de logs sont situés dans le dossier /logs/ et sont générés automatiquement.

# First Use Case - Distributed Call Analytics System :

## Architecture Documentation


![pdf](./assets/Plugandtel.png)


## Approche de Gestion des Erreurs et Retentatives
Pour garantir une gestion fiable des erreurs, chaque service utilise un système de retentatives structuré :

Tentatives automatiques En cas d’échec, un job est automatiquement retenté jusqu'à un nombre maximum de tentatives (par ex., 3 pour transcriptionQueue). Cela permet de gérer les erreurs temporaires sans intervention.

Déplacement vers retryQueue Si un job échoue à plusieurs reprises, il est transféré dans une retryQueue dédiée.

Suivi des échecs et alertes  Chaque échec est enregistré pour une analyse ultérieure. Si un job atteint le nombre maximal de tentatives dans retryQueue, il est marqué comme "failed", et une alerte est générée pour une intervention.