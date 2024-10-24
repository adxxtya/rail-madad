import { db } from "@/server/db";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

interface PageProps {
  params: {
    trackingId: string;
  };
}

const ComplaintPage: React.FC<PageProps> = async ({ params }) => {
  const complaint = await db.complaint.findFirst({
    where: {
      id: params.trackingId,
    },
  });

  if (!complaint) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold">Complaint not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Side: Complaint Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Complaint Details</h1>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Tracking ID:</p>
            <p className="text-lg">{complaint.id}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Complaint By:</p>
            <p className="text-lg">{complaint.name}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Phone Number:</p>
            <p className="text-lg">{complaint.phoneNumber}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Email:</p>
            <p className="text-lg">{complaint.email}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">
              Category of the Complaint:
            </p>
            <p className="text-lg">
              {complaint.category ??
                "The ML Model is working on categorizing this complaint and it will be available soon."}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">
              Summary of the Complaint:
            </p>
            <p className="text-lg">
              <ReactMarkdown>
                {complaint.summary ??
                  "This complaint requires administrative governance, please wait until further processing."}
              </ReactMarkdown>
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">
              Details of the Complaint:
            </p>
            <p className="text-lg">{complaint.info ?? "N/A"}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Created At:</p>
            <p className="text-lg">
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Last Updated:</p>
            <p className="text-lg">
              {new Date(complaint.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Side: Complaint Media */}
        <div className="flex items-start justify-center">
          {complaint.complaintMediaUrl ? (
            <img
              src={complaint.complaintMediaUrl}
              alt="Complaint Media"
              className="h-auto max-w-full rounded-lg shadow-lg"
            />
          ) : (
            <p className="text-gray-500">No media available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;
