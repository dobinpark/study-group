import { NextRequest, NextResponse } from 'next/server';

type Props = {
    params: {
        id: string;
    };
};

export async function POST(request: NextRequest, props: Props) {
    const { id } = props.params;
    return NextResponse.json({ success: true });
} 