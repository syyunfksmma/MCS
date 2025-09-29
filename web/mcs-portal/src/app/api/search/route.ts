import { NextResponse } from 'next/server';

const mockItems = Array.from({ length: 50 }).map((_, index) => ({
  routingId: `ROUTING-${index + 1}`,
  routingCode: `RT-${(index + 1).toString().padStart(3, '0')}`,
  productCode: `PROD-${Math.ceil((index + 1) / 5).toString().padStart(3, '0')}`,
  revisionCode: `REV-${(index % 3) + 1}`,
  groupName: index % 2 === 0 ? 'Main' : 'Secondary',
  status: index % 4 === 0 ? '완료' : '진행 중',
  updatedAt: new Date(Date.now() - index * 60000).toISOString(),
  slaMs: 500 + index * 5,
  mock: true
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('q')?.toLowerCase() ?? '';
  const limit = Number(searchParams.get('limit') ?? 10);

  const filtered = mockItems.filter((item) =>
    !term ||
    item.routingCode.toLowerCase().includes(term) ||
    item.productCode.toLowerCase().includes(term)
  );

  const data = filtered.slice(0, limit);
  return NextResponse.json({
    total: filtered.length,
    items: data,
    observedClientMs: Math.floor(Math.random() * 300) + 200,
    slaMs: 1500
  });
}
