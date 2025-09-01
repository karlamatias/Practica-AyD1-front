import type { ClientJob } from "../../types/client";
import ClientWorkCard from "../organisms/ClientWorkCard";
interface ClientWorkListProps {
  works: ClientJob[];
  vehicle: string;
  onApproveService?: (
    requestApproveId: number,
    approveType: string,
    comment: string
  ) => void;
  onLeaveReview?: (rating: number, workId: number, comment: string) => void;
  onMakePayment?: (
    workId: number,
    amount: number,
    paymentMethodId: number
  ) => void;
  onDownloadInvoice?: (workId: number) => void;
}

export default function ClientWorkList({
  works,
  vehicle,
  onApproveService,
  onLeaveReview,
  onMakePayment,
  onDownloadInvoice,
}: ClientWorkListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {works.map((job) => (
        <>
          <ClientWorkCard
            key={job.id}
            {...job}
            parentJob={job.parentJob}
            vehicle={vehicle}
            onApproveService={onApproveService}
            onLeaveReview={onLeaveReview}
            onMakePayment={onMakePayment}
            onDownloadInvoice={onDownloadInvoice}
          />
        </>
      ))}
    </div>
  );
}
