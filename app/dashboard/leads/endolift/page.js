'use client';
import LeadsTable from '@/components/LeadsTable';
import { ENDOLIFT_COLUMNS, ENDOLIFT_DEFAULT_VISIBLE, ENDOLIFT_EDITABLE, ENDOLIFT_CHECKBOX_FIELDS } from '@/lib/constants';

export default function EndoliftLeadsPage() {
  return (
    <LeadsTable
      title="Endolift Leads"
      subtitle="All leads captured for Endolift."
      tableSlug="endolift"
      columns={ENDOLIFT_COLUMNS}
      storageKey="leadsEndoliftColumns"
      defaultVisible={ENDOLIFT_DEFAULT_VISIBLE}
      editableColumns={ENDOLIFT_EDITABLE}
      checkboxColumns={ENDOLIFT_CHECKBOX_FIELDS}
    />
  );
}
