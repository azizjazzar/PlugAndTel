
# PlugAndTell Second Use Case - Real-time Audio Processing System

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version >= 20.16.0)
- [NPM](https://www.npmjs.com/) (version >= 10.8.1)


## Installation

1. Clonez ce projet :
   ```bash
   git clone https://github.com/ton-utilisateur/PlugAndTell.git
   ```

2. Accédez au répertoire du projet :
   ```bash
   cd PlugAndTell
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
PlugAndTell/
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


![pdf](./assets/SystemArchitectureDiagram.pdf)



b) Approche de Gestion des Erreurs et Retentatives
Pour chaque service, nous avons mis en place un système de gestion des erreurs pour garantir que les jobs échoués soient traités de manière appropriée :

Tentatives automatiques : Si un job échoue, il est automatiquement retenté jusqu'au nombre maximum de tentatives configuré (par exemple, 3 pour transcriptionQueue).

Déplacement vers retryQueue : Si un job échoue de façon répétée et atteint le maximum de tentatives dans une queue, il est transféré dans retryQueue. Cette queue est spécialement conçue pour essayer de traiter à nouveau ces jobs après un certain délai, en augmentant progressivement le délai entre chaque tentative (backoff exponentiel).

Suivi et Enregistrement des Échecs : Chaque échec de job est enregistré. Si un job atteint le nombre maximum de tentatives dans retryQueue, il est marqué comme "failed" de manière définitive, et une alerte peut être générée pour enquête.