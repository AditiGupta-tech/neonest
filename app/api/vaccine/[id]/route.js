import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Vaccine from '@/app/models/Vaccine.model';
import { authenticateToken } from '@/lib/auth';

export async function PUT(req, context) {
  connectDB();

  const userReq = await authenticateToken(req);
  const userId = userReq?.user?.id;
  const params = await context.params;
  const vaccineId = params.id;

  if (!userId || !vaccineId) {
    return NextResponse.json({ error: 'Missing user ID or vaccine ID' }, { status: 400 });
  }

  try {
    const { completedDate } = await req.json();

    const updatedVaccine = await Vaccine.findOneAndUpdate(
      { _id: vaccineId, userId },
      {
        status: 'completed',
        completedDate: completedDate || new Date(),
      },
      { new: true }
    );

    if (!updatedVaccine) {
      return NextResponse.json({ error: 'Vaccine not found' }, { status: 404 });
    }

    return NextResponse.json(updatedVaccine);
  } catch (error) {
    console.error('Error marking vaccine as completed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ======================= DELETE =======================
export async function DELETE(req , context) {
  const params = await context.params;
  const vaccineId = params.id;
  const userReq = await authenticateToken(req);
  const userId = userReq?.user?.id;
  console.log(vaccineId)

  if (!userId || !vaccineId) {
    return NextResponse.json({ error: 'Missing user ID or vaccine ID' }, { status: 400 });
  }

  try {
    const deletedVaccine = await Vaccine.findOneAndDelete({
      _id: vaccineId,
      userId,
    });

    if (!deletedVaccine) {
      return NextResponse.json({ error: 'Vaccine not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
