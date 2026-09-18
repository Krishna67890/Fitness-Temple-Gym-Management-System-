import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, portalType } = await request.json();

    if (portalType === 'owner') {
      if (
        email === process.env.OWNER_EMAIL &&
        password === process.env.OWNER_PASSWORD
      ) {
        return NextResponse.json({
          success: true,
          role: 'owner',
          name: 'Gym Owner',
          id: 'owner_admin'
        });
      }
    } else if (portalType === 'trainer') {
      if (
        email === process.env.TRAINER_SURAJ_EMAIL &&
        password === process.env.TRAINER_SURAJ_PASSWORD
      ) {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: 'trainer_suraj',
          name: 'Suraj Sir'
        });
      }
      if (
        email === process.env.TRAINER_SANKET_EMAIL &&
        password === process.env.TRAINER_SANKET_PASSWORD
      ) {
        return NextResponse.json({
          success: true,
          role: 'trainer',
          trainerId: 'trainer_sanket',
          name: 'Sanket Sir'
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid portal credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
