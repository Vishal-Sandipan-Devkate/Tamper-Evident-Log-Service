import crypto from "crypto";

export function generateHash({
  previousHash,
  actor,
  action,
  payload,
  createdAt,
}) {
  const hashInput = [
    previousHash,
    actor,
    action,
    JSON.stringify(payload),
    new Date(createdAt).toISOString(),
  ].join("|");

  return crypto.createHash("sha256").update(hashInput).digest("hex");
}
