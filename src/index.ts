// Note: the code from the docs just hangs.
// The docs: https://docs.bullmq.io/
//
// I used code from here:
// https://openbase.io/js/bullmq/documentation
//
// then switched to bull.
import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(6379, "localhost");

const queue = new Queue("Paint", {
    connection,
});

queue.add("cars", { color: "blue" }); // { delay: 2000 } just hangs.

console.log("added jobs");

// You can have as many worker processes as you want, BullMQ will distribute the jobs across your workers in a round robin fashion.
const worker = new Worker(
    "Paint",
    async (job) => {
        console.log("from the worker", job.data);
    },
    {
        connection,
    }
);

const queueEvents = new QueueEvents("UpdateDiscourse");

queueEvents.on("completed", (job) => {
    console.log(`job ${job.jobId} has completed`, JSON.stringify(job));
});

queueEvents.on("failed", (job, err) => {
    console.log(`${job.id} has failed with err:`, err);
});

console.log("end");
