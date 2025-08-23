module.exports = {
  apps: [
    {
      name: "takeanoteapp-backend",
      script: "./bin/www",
      watch: true,
      merge_logs: true,
      ignore_watch: ["node_modules", "public"],
      cwd: "./",
    },
  ],
};
