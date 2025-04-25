import { NextResponse } from 'next/server';

// Add this export to prevent static generation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lineItems, customItems } = body;

    // Sending to AWS API instead of BigCommerce directly
    const response = await fetch('https://1rhblo3b31.execute-api.us-east-1.amazonaws.com/testv2/create-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        lineItems: lineItems,
        customItems: customItems,
      }),
    });
     
    if (!response.ok) {
      throw new Error('Failed to create cart');
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}