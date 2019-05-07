const isDev: boolean = process.argv[2] === "develop";
const port: number = 1234;

export default {
  port,
  uploadDir: "/upload/ups/",
  isDev,
};
