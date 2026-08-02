/**
 * Integration stubs — replace with Mailgun / WhatsApp Business API later.
 * Never throw; checkout must succeed without external services.
 */

export async function stubSendOrderConfirmationEmail(args: {
  to: string;
  confirmationNumber: string;
  totalLabel: string;
}): Promise<{ stubbed: true; logged: string }> {
  const logged = `[stub:email] Would send order ${args.confirmationNumber} (${args.totalLabel}) to ${args.to}`;
  console.log(logged);
  // TODO: Mailgun — sendMail({ to, subject, html })
  return { stubbed: true, logged };
}

export function buildWhatsAppDeepLink(args: {
  shopWhatsAppE164: string | null | undefined;
  confirmationNumber: string;
  fullName: string;
}): string | null {
  if (!args.shopWhatsAppE164) return null;
  const digits = args.shopWhatsAppE164.replace(/[^\d]/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(
    `Hello Al Athaq Boutique — I placed order ${args.confirmationNumber} (${args.fullName}).`,
  );
  // TODO: WhatsApp Business API for automated messages
  return `https://wa.me/${digits}?text=${text}`;
}
