// app/api/bigcommerce/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Add this export to prevent static generation
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, customer } = body;

    if (!cartId) {
      return NextResponse.json(
        { success: false, message: 'Cart ID is required' },
        { status: 400 }
      );
    }

    console.log('Initiating checkout for cart:', cartId);
    console.log('Customer data:', customer);

    // Call your Lambda function to initialize the checkout
    const lambdaResponse = await fetch(
      'https://1rhblo3b31.execute-api.us-east-1.amazonaws.com/testv2/checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          customer
        }),
      }
    );

    if (!lambdaResponse.ok) {
      const errorData = await lambdaResponse.json();
      console.error('Lambda checkout error:', errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to initialize checkout',
          error: errorData.error || 'Unknown error',
        },
        { status: lambdaResponse.status }
      );
    }

    const data = await lambdaResponse.json();
    console.log('Checkout response:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}