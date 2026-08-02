'use client';
import LeadsTable from '@/components/LeadsTable';
import { HYDRA_FACIAL_COLUMNS, HYDRA_FACIAL_DEFAULT_VISIBLE, HYDRA_FACIAL_EDITABLE, HYDRA_FACIAL_CHECKBOX_FIELDS } from '@/lib/constants';

export default function HydraFacialLeadsPage() {
  return (
    <LeadsTable
      title="Hydra Facial Leads"
      subtitle="All leads captured for Hydra Facial."
      tableSlug="hydra-facial"
      columns={HYDRA_FACIAL_COLUMNS}
      storageKey="leadsHydraFacialColumns"
      defaultVisible={HYDRA_FACIAL_DEFAULT_VISIBLE}
      editableColumns={HYDRA_FACIAL_EDITABLE}
      checkboxColumns={HYDRA_FACIAL_CHECKBOX_FIELDS}
    />
  );
}
