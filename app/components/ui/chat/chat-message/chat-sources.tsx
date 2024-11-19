import { Check, Copy, FileText } from "lucide-react";
import Image from "next/image";
import { Suspense, use, useMemo } from "react";
import { Button } from "../../button";
import PdfDialog from "../../chat/widgets/PdfDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../../dialog";
import { FileIcon } from "../../document-preview";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../hover-card";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../scroll-area";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { DocumentFileType, SourceData, SourceNode } from "../index";

type Document = {
  url: string;
  sources: SourceNode[];
};

export function ChatSources({ data }: { data: SourceData }) {
  const documents: Document[] = useMemo(() => {
    // group nodes by document (a document must have a URL)
    const nodesByUrl: Record<string, SourceNode[]> = {};
    data.nodes.forEach((node) => {
      const key = node.url;
      nodesByUrl[key] ??= [];
      nodesByUrl[key].push(node);
    });

    // convert to array of documents
    return Object.entries(nodesByUrl).map(([url, sources]) => ({
      url,
      sources,
    }));
  }, [data.nodes]);

  if (documents.length === 0) return null;

  return (
    <div className="space-y-2 text-sm">
      <div className="font-semibold text-lg">Sources:</div>
      <div className="flex gap-3 flex-wrap">
        {documents.map((document) => {
          return !document.sources.length ? null : (
            <DocumentInfo key={document.url} sourceDocument={document} />
          );
        })}
      </div>
    </div>
  );
}

export function SourceInfo({
  node,
  index,
}: {
  node?: SourceNode;
  index: number;
}) {
  if (!node) return <SourceNumberButton index={index} />;
  return (
    <HoverCard>
      <HoverCardTrigger
        className="cursor-default"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SourceNumberButton
          index={index}
          className="hover:text-white hover:bg-primary"
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px]">
        <NodeInfo nodeInfo={node} />
      </HoverCardContent>
    </HoverCard>
  );
}

export function SourceNumberButton({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs w-5 h-5 rounded-full bg-gray-100 inline-flex items-center justify-center",
        className,
      )}
    >
      {index + 1}
    </span>
  );
}

function DocumentInfo({ sourceDocument }: { sourceDocument: Document }) {
  const { url, sources } = sourceDocument;
  const fileName = sources[0].metadata.file_name as string | undefined;
  const fileExt = fileName?.split(".").pop();
  const fileImage = fileExt ? FileIcon[fileExt as DocumentFileType] : null;

  const DocumentDetail = (
    <div
      key={url}
      className="h-28 w-48 flex flex-col justify-between p-4 border rounded-md shadow-md cursor-pointer"
    >
      <p
        title={fileName}
        className={cn(
          fileName ? "truncate" : "text-blue-900 break-words",
          "text-left",
        )}
      >
        {fileName ?? url}
      </p>
      <div className="flex justify-between items-center">
        <div className="space-x-2 flex">
          {sources.map((node: SourceNode, index: number) => {
            return (
              <div key={node.id}>
                <SourceInfo node={node} index={index} />
              </div>
            );
          })}
        </div>
        {fileImage ? (
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
            <Image
              className="h-full w-auto"
              priority
              src={fileImage}
              alt="Icon"
            />
          </div>
        ) : (
          <FileText className="text-gray-500" />
        )}
      </div>
    </div>
  );

  if (url.endsWith(".pdf")) {
    // open internal pdf dialog for pdf files when click document card
    return <PdfDialog documentId={url} url={url} trigger={DocumentDetail} />;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div>{DocumentDetail}</div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{fileName}</DialogTitle>
            {/*<DialogDescription>This is description</DialogDescription>*/}
          </DialogHeader>
          {/*This is content*/}
          <Suspense fallback={""}>
            <DocumentDialogContent res={fetch(url).then((res) => res.text())} />
          </Suspense>
          <DialogFooter>
            <DialogClose>
              <div
                className={
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium " +
                  "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
                  "bg-primary text-primary-foreground hover:bg-primary/90 " +
                  "h-10 px-4 py-2"
                }
              >
                Close
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function DocumentDialogContent({ res }: { res: Promise<string> }) {
  const content = use(res);
  console.log(content);

  return <ScrollArea className={"h-72 w-128 rounded-md"}>{content}</ScrollArea>;
}

function NodeInfo({ nodeInfo }: { nodeInfo: SourceNode }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 });

  const pageNumber =
    // XXX: page_label is used in Python, but page_number is used by Typescript
    (nodeInfo.metadata?.page_number as number) ??
    (nodeInfo.metadata?.page_label as number) ??
    null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold">
          {pageNumber ? `On page ${pageNumber}:` : "Node content:"}
        </span>
        {nodeInfo.text && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(nodeInfo.text);
            }}
            size="icon"
            variant="ghost"
            className="h-12 w-12 shrink-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {nodeInfo.text && (
        <pre className="max-h-[200px] overflow-auto whitespace-pre-line">
          &ldquo;{nodeInfo.text}&rdquo;
        </pre>
      )}
    </div>
  );
}
