import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, portalType } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Standard generic message to prevent account enumeration
    const invalidResponse = () => NextResponse.json(
      { success: false, message: 'Invalid email or password.' },
      { status: 401 }
    );

    if (portalType === 'owner') {
      if (cleanEmail === 'sanket@fitnesstemple.com' && password === 'Sanket@123') {
        return NextResponse.json({
          success: true,
          role: 'owner',
          name: 'Sanket Sir (Owner)',
          email: 'sanket@fitnesstemple.com',
          id: 'owner_admin'
        });
      }
      return invalidResponse();
    }

    if (portalType === 'trainer') {
      if (cleanEmail === 'suraj@fitnesstemple.com' && password === 'Suraj@123') {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: 'trainer_suraj',
          name: 'Suraj Sir',
          email: 'suraj@fitnesstemple.com'
        });
      }
      if (
        (cleanEmail === 'bhavesh@fitnesstemple.com' || cleanEmail === 'bhavesh@ftnesstemple.com') &&
        password === 'Bhavesh@123'
      ) {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: 'trainer_bhavesh',
          name: 'Bhavesh Sir',
          email: 'bhavesh@ftnesstemple.com'
        });
      }
      return invalidResponse();
    }

    return invalidResponse();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid email or password.' },
      { status: 500 }
    );
  }
}
