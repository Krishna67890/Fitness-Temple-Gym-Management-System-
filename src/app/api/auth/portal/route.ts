import { NextResponse } from 'next/server';
import { OWNER_EMAIL, OWNER_NAME, TRAINERS } from '@/lib/constants';

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
      if (cleanEmail === OWNER_EMAIL && password === process.env.OWNER_SECURITY_KEY) {
        return NextResponse.json({
          success: true,
          role: 'owner',
          name: `${OWNER_NAME} (Owner)`,
          email: OWNER_EMAIL,
          id: 'owner_admin'
        });
      }
      return invalidResponse();
    }

    if (portalType === 'trainer') {
      if (cleanEmail === TRAINERS.SURAJ.email && password === process.env.TRAINER_SURAJ_SECURITY_KEY) {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: TRAINERS.SURAJ.id,
          name: TRAINERS.SURAJ.name,
          email: TRAINERS.SURAJ.email
        });
      }
      if (
        (cleanEmail === TRAINERS.BHAVESH.email || cleanEmail === 'bhavesh@ftnesstemple.com') &&
        password === process.env.TRAINER_BHAVESH_SECURITY_KEY
      ) {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: TRAINERS.BHAVESH.id,
          name: TRAINERS.BHAVESH.name,
          email: TRAINERS.BHAVESH.email
        });
      }
      return invalidResponse();
    }

    if (portalType === 'member') {
      // Demo member account
      if (cleanEmail === 'krishna@fitnesstemple.com' && password === process.env.MEMBER_SECURITY_KEY) {
        return NextResponse.json({
          success: true,
          role: 'member',
          name: 'Krishna Patil Rajput',
          email: 'krishna@fitnesstemple.com',
          id: 'local_member_001'
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
