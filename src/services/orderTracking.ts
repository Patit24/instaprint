import { OrderRecord } from '../types';
import { STORE_INFO } from '../data/products';

export interface OrderStatusStageInfo {
  stageIndex: number;
  statusLabel: string;
  badgeClass: string;
  location: string;
  locationDetail: string;
  steps: {
    title: string;
    desc: string;
    location: string;
    done: boolean;
    current: boolean;
  }[];
}

/**
 * Computes dynamic real-world order lifecycle stages and real location
 * based on admin status changes. Completely safe against undefined/null.
 */
export function getOrderStatusStageInfo(order?: OrderRecord | null): OrderStatusStageInfo {
  const isPickup = order?.customer?.deliveryMethod === 'store-pickup' || (order as any)?.deliveryMethod === 'store-pickup';
  const currentStatus: OrderRecord['orderStatus'] = order?.orderStatus || 'received';
  const trackingNum = order?.trackingNumber || 'INP-TRK-PENDING';

  const statusOrder: Record<OrderRecord['orderStatus'], number> = {
    'received': 0,
    'artwork-review': 1,
    'printing': 2,
    'qc-packed': 3,
    'dispatched': 4,
    'delivered': 5,
    'cancelled': -1
  };

  const currentIndex = statusOrder[currentStatus] ?? 0;

  const baseSteps = [
    {
      title: "Order Placed & Tracking ID Generated",
      desc: "Job ticket registered in workshop queue, materials allocated",
      location: "Intake Registry & Order Desk, Shop 106/B, Baranagar, Kolkata",
    },
    {
      title: "Pre-Press Artwork & DPI Verification",
      desc: "1200 DPI resolution, bleed borders, and custom typography validated",
      location: "Design & Pre-Press Station, INSTAPRINT Studio Baranagar",
    },
    {
      title: "Commercial UV / Offset Printing & Curing",
      desc: "Industrial Roland TrueVIS UV printing & LED curing on active press bed",
      location: "Roland UV & Digital Offset Bay, Baranagar Workshop Floor",
    },
    {
      title: "5-Point Quality Check & Packaging",
      desc: "Color accuracy, die-cut trim, substrate integrity, and GST invoice verification",
      location: "Quality Inspection & Secure Boxing Desk, Baranagar Studio",
    },
    {
      title: isPickup ? "Store Pickup Counter Ready" : "Dispatched via Express Courier",
      desc: isPickup
        ? "Ready at counter shelf. Present Tracking ID at Shop 106/B for immediate pickup"
        : "Handed over to DTDC/Delhivery express air logistics with real-time transit AWB",
      location: isPickup
        ? "Front Counter Pickup Shelf, Shop 106/B, Gopal Lal Tagore Rd, Kolkata 700036"
        : "In Transit • Express Regional Logistics Hub",
    },
    {
      title: isPickup ? "Collected by Customer" : "Delivered to Doorstep",
      desc: isPickup ? "Picked up from Baranagar studio counter" : "Delivered with signature receipt",
      location: isPickup ? "Instaprint Baranagar Studio" : "Customer Address",
    }
  ];

  const steps = baseSteps.map((step, idx) => ({
    ...step,
    done: currentIndex > idx,
    current: currentIndex === idx
  }));

  let location = "Intake Registry Desk, Shop 106/B, Baranagar, Kolkata";
  let locationDetail = "Order logged into workshop queue. Materials reserved.";
  let statusLabel = "Order Confirmed";
  let badgeClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";

  if (currentStatus === 'received') {
    location = "Intake Registry Desk, Shop 106/B, Gopal Lal Tagore Rd, Baranagar";
    locationDetail = "Order logged in workshop queue. Unique Tracking ID registered. Job ticket allocated to pre-press desk.";
    statusLabel = "Order Placed & Confirmed";
    badgeClass = "bg-blue-500/20 text-blue-400 border-blue-500/30";
  } else if (currentStatus === 'artwork-review') {
    location = "Design & Pre-Press Station, INSTAPRINT Studio Baranagar";
    locationDetail = "Graphic artists verifying 1200 DPI resolution, crop borders, and customer instructions. Digital proof ready on WhatsApp.";
    statusLabel = "Artwork Review & DPI Check";
    badgeClass = "bg-purple-500/20 text-purple-400 border-purple-500/30";
  } else if (currentStatus === 'printing') {
    location = "Roland TrueVIS UV & Digital Offset Bay, Baranagar Floor";
    locationDetail = "Physical substrate on active press bed. Industrial UV curing and laser contour profiling in progress.";
    statusLabel = "Printing & Curing in Progress";
    badgeClass = "bg-amber-500/20 text-amber-400 border-amber-500/30";
  } else if (currentStatus === 'qc-packed') {
    location = "QC & Tamper-Proof Packaging Desk, Shop 106/B Baranagar";
    locationDetail = "5-point quality check completed (alignment, color fidelity, substrate integrity). Packed in shockproof wrap with GST invoice.";
    statusLabel = "QC Inspection Passed & Packed";
    badgeClass = "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
  } else if (currentStatus === 'dispatched') {
    if (isPickup) {
      location = "Store Pickup Counter, Shop 106/B, Gopal Lal Tagore Rd, Baranagar (Open 11 AM - 9 PM)";
      locationDetail = "Order ready on store shelf. Please present your Tracking ID at the front desk for instant collection!";
      statusLabel = "Ready for Store Pickup";
      badgeClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    } else {
      location = `In Transit with Courier (Tracking: ${trackingNum})`;
      locationDetail = "Dispatched from Baranagar facility. Out for delivery via express air/city courier.";
      statusLabel = "Out for Express Delivery";
      badgeClass = "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  } else if (currentStatus === 'delivered') {
    location = "Delivered to Customer";
    locationDetail = "Package successfully received and signed off. Thank you for printing with INSTAPRINT!";
    statusLabel = "Delivered & Completed";
    badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  } else if (currentStatus === 'cancelled') {
    location = "Customer Support & Accounts Desk";
    locationDetail = "Order cancelled. If payment was collected, full refund has been credited to source.";
    statusLabel = "Order Cancelled";
    badgeClass = "bg-rose-500/20 text-rose-400 border-rose-500/30";
  }

  return {
    stageIndex: currentIndex,
    statusLabel,
    badgeClass,
    location,
    locationDetail,
    steps
  };
}
