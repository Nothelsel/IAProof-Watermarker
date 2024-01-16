module.exports = {
  apps: [{
    name: "IAProof-Watermarker",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
    },
    watch: true,
    ignore_watch: ["node_modules", "ecosystem.config.js", ".gitignore", "README.md"],
  }]
};
