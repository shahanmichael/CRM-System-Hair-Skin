'use client';
import LeadsTable from '@/components/LeadsTable';
import { LIP_BLUSHING_FILLERS_COLUMNS, LIP_BLUSHING_FILLERS_DEFAULT_VISIBLE, LIP_BLUSHING_FILLERS_EDITABLE, LIP_BLUSHING_FILLERS_CHECKBOX_FIELDS } from '@/lib/constants';

export default function LipBlushingFillersLeadsPage() {
  return (
    <LeadsTable
      title="Lip Blushing & Fillers Leads"
      subtitle="All leads captured for Lip Blushing & Fillers."
      tableSlug="lip-blushing-fillers"
      columns={LIP_BLUSHING_FILLERS_COLUMNS}
      storageKey="leadsLipBlushingFillersColumns"
      defaultVisible={LIP_BLUSHING_FILLERS_DEFAULT_VISIBLE}
      editableColumns={LIP_BLUSHING_FILLERS_EDITABLE}
      checkboxColumns={LIP_BLUSHING_FILLERS_CHECKBOX_FIELDS}
    />
  );
}
