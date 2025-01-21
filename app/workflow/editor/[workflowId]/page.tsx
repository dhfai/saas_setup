import { waitFor } from '@/lib/helper/waitFor';
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import Editor from '../../_components/Editor';

const Page = async ({ params }: { params: { workflowId: string } }) => {
    const { workflowId } = await Promise.resolve(params);

    const { userId } = await auth();

    if (!userId) return <div>Not authenticated</div>;
    

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    });

    if (!workflow) {
        return <div>Workflow not found</div>;
    }
    return (
        <div>
            <Editor workflow={workflow} />
        </div>
    );
};

export default Page;