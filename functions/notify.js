export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const TG_TOKEN   = env.TG_TOKEN;
  const TG_CHAT_ID = env.TG_CHAT_ID;

  if (!TG_TOKEN || !TG_CHAT_ID) {
    return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const msg = `🔔 새 상담 신청\n\n`
    + `👤 이름: ${data.name}\n`
    + `📞 연락처: ${data.contact}\n`
    + `📦 플랜: ${data.plan || '미정'}\n`
    + `📝 내용:\n${data.content}`
    + (data.ref ? `\n🔗 참고: ${data.ref}` : '')
    + `\n\n🕐 ${data.date}`;

  const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg })
  });

  const result = await tgRes.json();
  return new Response(JSON.stringify(result), {
    status: tgRes.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
