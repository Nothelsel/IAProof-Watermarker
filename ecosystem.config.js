// ecosystem.config.js
module.exports = {
    apps: [{
      name: 'Portefolio', // Un nom pour votre application
      script: 'npm', // Le script pour démarrer votre application
      args: 'start', // Les arguments pour exécuter le script
      watch: true, // Redémarrer automatiquement en cas de modification des fichiers
      env: {
        NODE_ENV: 'production', // Environnement dans lequel l'application doit s'exécuter
      },
    }],
  };
  