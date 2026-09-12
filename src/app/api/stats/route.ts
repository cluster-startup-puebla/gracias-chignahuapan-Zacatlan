import {NextRequest, NextResponse} from 'next/server';
import {
  getAllScans,
  getAllEmails,
  getStatsByProduct,
  getScansByDate,
  getTodayScans,
} from '@/data/scans';

export async function GET(request: NextRequest) {
  const pin = request.headers.get('x-admin-pin');
  if (pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({error: 'unauthorized'}, {status: 401});
  }

  return NextResponse.json({
    totalScans: getAllScans().length,
    todayScans: getTodayScans(),
    byProduct: getStatsByProduct(),
    byDate: getScansByDate(),
    recentScans: getAllScans().slice(-20).reverse(),
    emails: getAllEmails(),
  });
}
