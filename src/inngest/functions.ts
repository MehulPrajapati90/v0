import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "agent/hello" },
    async ({ event, step }) => {

        const sandboxId = await step.run("get-sandbox-ai", async () => {
            const sandbox = await Sandbox.create("v0-nextjs-build-sandbox");
            return sandbox.sandboxId;
        });

        const helloAgent = createAgent({
            name: "hello",
            description: "A simple agent that says hello",
            system: "You are a helpful assistant. Always greet with enthusiasm",
            model: gemini({ model: "gemini-2.5-flash" })
        });

        const { output } = await helloAgent.run("Say hello to the user");

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await Sandbox.connect(sandboxId);
            const host = sandbox.getHost(3000);
            return `http://${host}`;
        })

        return {
            // @ts-ignore
            message: output[0]?.content
        }
    },
);