'use client';

import type { UploadProps } from 'antd';
import { Button, message, Upload, Typography } from 'antd';
import type { ExplorerRouting } from '@/types/explorer';
import { useMemo, useState } from 'react';

const { Paragraph, Text } = Typography;

interface WorkspaceMetaPanelProps {
  routing?: ExplorerRouting | null;
}

interface MetaPreview {
  json: string;
  source: 'generated' | 'uploaded';
  filename: string;
}

const buildMockMeta = (routing: ExplorerRouting) => ({
  routingId: routing.id,
  routingCode: routing.code,
  camRevision: routing.camRevision,
  generatedAt: new Date().toISOString(),
  files: routing.files.map((file) => ({
    id: file.id,
    name: file.name,
    type: file.type
  }))
});

export default function WorkspaceMetaPanel({
  routing
}: WorkspaceMetaPanelProps) {
  const [preview, setPreview] = useState<MetaPreview | null>(null);

  const targetPath = useMemo(() => {
    if (!routing) {
      return 'Routings/<routingId>/meta.json';
    }
    return `Routings/${routing.id}/meta.json`;
  }, [routing]);

  const handleGenerate = () => {
    if (!routing) {
      message.warning('Select a routing before generating meta.json.');
      return;
    }
    const meta = buildMockMeta(routing);
    const json = JSON.stringify(meta, null, 2);
    setPreview({
      json,
      source: 'generated',
      filename: `${routing.code}-meta.json`
    });
    message.success('Mock meta.json generated.');
  };

  const handleDownload = () => {
    if (!routing) {
      message.warning('Select a routing before downloading meta.json.');
      return;
    }
    const meta = buildMockMeta(routing);
    const blob = new Blob([JSON.stringify(meta, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${routing.code}-meta.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('Mock meta.json download started.');
  };

  const uploadProps: UploadProps = {
    accept: '.json',
    showUploadList: false,
    beforeUpload: async (file: File) => {
      if (!routing) {
        message.warning('Select a routing before uploading meta.json.');
        return Upload.LIST_IGNORE;
      }
      try {
        const text = await file.text();
        JSON.parse(text);
        setPreview({ json: text, source: 'uploaded', filename: file.name });
        message.success(`meta.json ${file.name} loaded (validation pending).`);
      } catch (error) {
        message.error('Invalid JSON file.');
      }
      return Upload.LIST_IGNORE;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Text strong>Target path:</Text> {targetPath}
      </div>
      <Paragraph type="secondary" className="mb-0 text-sm">
        Naming rule: <code>Routings/&lt;routingId&gt;/meta.json</code> (routing
        code mirrored in file name for exports).
      </Paragraph>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleGenerate} disabled={!routing}>
          Generate Preview
        </Button>
        <Button onClick={handleDownload} disabled={!routing}>
          Download Mock meta.json
        </Button>
        <Upload {...uploadProps}>
          <Button disabled={!routing}>Upload meta.json</Button>
        </Upload>
      </div>
      {preview ? (
        <div className="rounded-md bg-gray-900 p-4 text-sm text-gray-100 overflow-x-auto">
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>{preview.filename}</span>
            <span>
              {preview.source === 'generated' ? 'Generated' : 'Uploaded'}{' '}
              preview
            </span>
          </div>
          <pre className="whitespace-pre-wrap">{preview.json}</pre>
        </div>
      ) : (
        <Paragraph type="secondary">
          Generate or upload a meta.json to preview its contents.
        </Paragraph>
      )}
    </div>
  );
}
