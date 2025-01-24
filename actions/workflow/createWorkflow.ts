"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/Task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(
    form: createWorkflowSchemaType
): Promise<void> {
    const parsed = createWorkflowSchema.safeParse(form);

    if (!parsed.success) {
        throw new Error("Invalid form data");
    }

    const { userId } =await auth();
    if (!userId) {
        throw new Error("User not found");
    }

    const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
        nodes: [],
        edges: [],
    }

    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            ...parsed.data,
        },
    });

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`);
}