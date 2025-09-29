import ApiKeyManagement from "@/components/admin/ApiKeyManagement";

export const metadata = {
  title: "MCMS Admin | API Keys",
  description: "Manage API keys, parameters, and AD group mappings."
};

export default function AdminApiKeysPage() {
  return <ApiKeyManagement />;
}
