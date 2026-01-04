import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  cohortCount: number;

  // Applied filters sent to backend (server triggers Braze)
  payload: {
    filters: Record<string, string>;
    userIds: string[]; // internal ids or external ids (recommended: external_id in Braze)
  };

  onSend: (data: { campaignId: string; messageName?: string }) => Promise<void> | void;
};

const BrazeMessageSlideOver: React.FC<Props> = ({ isOpen, onClose, cohortCount, payload, onSend }) => {
  const [campaignId, setCampaignId] = React.useState("");
  const [messageName, setMessageName] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setCampaignId("");
    setMessageName("");
  }, [isOpen]);

  const submit = async () => {
    if (!campaignId.trim()) return;
    await onSend({ campaignId: campaignId.trim(), messageName: messageName.trim() || undefined });
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Trigger Braze Message"
      description="This will call your backend. Backend should call Braze API using secure keys."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={!campaignId.trim()}>
            Send
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
          <div className="font-semibold text-white">Cohort</div>
          <div className="mt-1 text-slate-300">
            Sending to <span className="font-semibold text-slate-100">{cohortCount}</span> users
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Payload includes applied filters + user IDs (or external_ids) so backend can create segment / send campaign.
          </div>
        </div>

        <TextField
          label="Braze Campaign ID"
          placeholder="e.g. 123abc-..."
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          hint="Use campaign_id from Braze (recommended: send via backend)."
        />

        <TextField
          label="Message Name (optional)"
          placeholder="e.g. Pro Winback - Spain - 7d"
          value={messageName}
          onChange={(e) => setMessageName(e.target.value)}
        />

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-slate-400">
          <div className="font-semibold text-slate-200">Backend Note</div>
          <div className="mt-1">
            Don’t call Braze directly from frontend. Create an endpoint like:
            <span className="ml-1 font-mono text-slate-200">POST /admin/braze/trigger</span>
          </div>
        </div>

        {/* payload preview (optional) */}
        <details className="rounded-xl border border-white/10 bg-black/20 p-3">
          <summary className="cursor-pointer text-xs text-slate-300">Show payload preview</summary>
          <pre className="mt-2 overflow-x-auto text-[10px] text-slate-400">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      </div>
    </SlideOver>
  );
};

export default BrazeMessageSlideOver;
