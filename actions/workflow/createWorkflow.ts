"use server";

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
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

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: "TODO",
            ...parsed.data,
        },
    });

    if (!result) {
        throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result.id}`);
}