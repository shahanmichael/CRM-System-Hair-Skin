'use client';
import LeadsTable from '@/components/LeadsTable';
import { HYDRA_COLUMNS, HYDRA_DEFAULT_VISIBLE, HYDRA_EDITABLE, HYDRA_CHECKBOX_FIELDS } from '@/lib/constants';

export default function HydraLeadsPage() {
  return (
    <LeadsTable
      title="Hydra Leads"
      subtitle="All leads captured for Hydra."
      tableSlug="hydra"
      columns={HYDRA_COLUMNS}
      storageKey="leadsHydraColumns"
      defaultVisible={HYDRA_DEFAULT_VISIBLE}
      editableColumns={HYDRA_EDITABLE}
      checkboxColumns={HYDRA_CHECKBOX_FIELDS}
    />
  );
}
