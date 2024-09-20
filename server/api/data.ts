export default defineEventHandler(async (event) => {
  await delay(5000);

  return [
    {
      name: "name 1",
    },
    {
      name: "name 2",
    },
    {
      name: "name 3",
    },
    {
      name: "name 4",
    },
  ];
});

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
