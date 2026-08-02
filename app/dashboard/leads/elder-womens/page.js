'use client';
import LeadsTable from '@/components/LeadsTable';
import { ELDER_WOMENS_COLUMNS, ELDER_WOMENS_DEFAULT_VISIBLE, ELDER_WOMENS_EDITABLE, ELDER_WOMENS_CHECKBOX_FIELDS } from '@/lib/constants';

export default function ElderWomensLeadsPage() {
  return (
    <LeadsTable
      title="Elder Womens Leads"
      subtitle="All leads captured for Elder Womens."
      tableSlug="elder-womens"
      columns={ELDER_WOMENS_COLUMNS}
      storageKey="leadsElderWomensColumns"
      defaultVisible={ELDER_WOMENS_DEFAULT_VISIBLE}
      editableColumns={ELDER_WOMENS_EDITABLE}
      checkboxColumns={ELDER_WOMENS_CHECKBOX_FIELDS}
    />
  );
}
