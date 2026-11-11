"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  AlertTriangle,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Radio,
  Clock,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  BarChart3,
  Bell,
  UserCheck,
  History,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

type AdminModule =
  | "overview"
  | "products"
  | "categories"
  | "collections"
  | "inventory"
  | "orders"
  | "customers"
  | "payments"
  | "shipping"
  | "returns"
  | "coupons"
  | "reviews"
  | "cms"
  | "marketing"
  | "analytics"
  | "notifications"
  | "admins"
  | "settings"
  | "audit";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventoryVariants, setInventoryVariants] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [marketingData, setMarketingData] = useState<any>({ campaigns: [], subscribers: [] });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // CMS state
  const [cmsData, setCmsData] = useState<any>(null);
  const [marqueeInput, setMarqueeInput] = useState("");
  const [dropTitle, setDropTitle] = useState("");
  const [dropSubtitle, setDropSubtitle] = useState("");
  const [dropTargetDate, setDropTargetDate] = useState("");
  const [cmsSuccess, setCmsSuccess] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    storeName: "BUILD CLOTHING CO.",
    currency: "INR (₹)",
    contactEmail: "support@buildclothing.com",
    contactPhone: "+91 98765 43210",
    freeShippingThreshold: 1499,
    stockWarningThreshold: 5,
    codEnabled: true,
    returnWindowDays: 7,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    fabric: "100% Combed Ringspun Cotton (260 GSM)",
    gsm: 260,
    fit: "Oversized Boxy Fit",
    printType: "High-Density Screen Print",
    printPlacement: "Chest & Full Back",
    artwork: "",
    basePrice: 1499,
    originalPrice: 2499,
    categoryId: "",
    collectionId: "",
    isNewDrop: true,
    isBestseller: false,
    isLimited: false,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
    colorName: "Washed Black",
    colorHex: "#151515",
    initialStock: 25,
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"CATEGORY" | "COLLECTION">("CATEGORY");

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    minOrderValue: "0",
    maxDiscount: "",
    validUntil: "",
    usageLimit: "",
  });
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [newCampaignName, setNewCampaignName] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN"))) {
      router.push("/auth/login");
      return;
    }

    if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      fetchAllAdminData();
    }
  }, [user, isLoading, router]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        ovRes,
        prodRes,
        ordRes,
        invRes,
        cmsRes,
        coupRes,
        catRes,
        custRes,
        payRes,
        revRes,
        admRes,
        mktRes,
        logRes,
        setRes,
      ] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/inventory"),
        fetch("/api/admin/cms"),
        fetch("/api/admin/coupons"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/customers"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/reviews"),
        fetch("/api/admin/admins"),
        fetch("/api/admin/marketing"),
        fetch("/api/admin/logs"),
        fetch("/api/admin/settings"),
      ]);

      const [
        ov,
        prod,
        ord,
        inv,
        cms,
        coup,
        cat,
        cust,
        pay,
        rev,
        adm,
        mkt,
        logs,
        st,
      ] = await Promise.all([
        ovRes.json(),
        prodRes.json(),
        ordRes.json(),
        invRes.json(),
        cmsRes.json(),
        coupRes.json(),
        catRes.json(),
        custRes.json(),
        payRes.json(),
        revRes.json(),
        admRes.json(),
        mktRes.json(),
        logRes.json(),
        setRes.json(),
      ]);

      if (ov.kpis) setOverviewData(ov);
      if (prod.products) setProducts(prod.products);
      if (ord.orders) setOrders(ord.orders);
      if (inv.variants) setInventoryVariants(inv.variants);
      if (cat.categories) setCategories(cat.categories);
      if (cat.collections) setCollections(cat.collections);
      if (cust.customers) setCustomers(cust.customers);
      if (pay.payments) setPayments(pay.payments);
      if (coup.coupons) setCoupons(coup.coupons);
      if (rev.reviews) setReviews(rev.reviews);
      if (adm.admins) setAdmins(adm.admins);
      if (mkt) setMarketingData(mkt);
      if (logs.logs) setAuditLogs(logs.logs);
      if (st.settings) setSettings(st.settings);

      if (cms) {
        setCmsData(cms);
        if (cms.marquees?.[0]) setMarqueeInput(cms.marquees[0].text);
        if (cms.dropCountdown) {
          setDropTitle(cms.dropCountdown.title);
          setDropSubtitle(cms.dropCountdown.subtitle || "");
          setDropTargetDate(cms.dropCountdown.targetDate?.slice(0, 10) || "");
        }
      }

      if (cat.categories?.[0]) {
        setNewProduct((prev) => ({ ...prev, categoryId: cat.categories[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    trackingNumber?: string,
    courierName?: string
  ) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, trackingNumber, courierName }),
      });
      if (res.ok) fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (variantId: string, stock: number) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock }),
      });
      if (res.ok) fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          categoryId: newProduct.categoryId || categories[0]?.id,
          images: [{ url: newProduct.imageUrl, alt: newProduct.title, isPrimary: true }],
          variants: ["S", "M", "L", "XL", "XXL"].map((sz) => ({
            size: sz,
            color: newProduct.colorName,
            colorHex: newProduct.colorHex,
            stock: newProduct.initialStock,
          })),
        }),
      });

      if (res.ok) {
        setShowAddProductModal(false);
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this piece?")) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, type: newCategoryType }),
      });
      setNewCategoryName("");
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string, type: "CATEGORY" | "COLLECTION") => {
    if (!confirm("Delete this taxonomy?")) return;
    try {
      await fetch(`/api/admin/categories?id=${id}&type=${type}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCMS = async () => {
    try {
      if (marqueeInput) {
        await fetch("/api/admin/cms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "MARQUEE", payload: { text: marqueeInput } }),
        });
      }
      if (dropTitle && dropTargetDate) {
        await fetch("/api/admin/cms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "DROP_COUNTDOWN",
            payload: {
              title: dropTitle,
              subtitle: dropSubtitle,
              targetDate: new Date(dropTargetDate).toISOString(),
              imageUrl: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
            },
          }),
        });
      }
      setCmsSuccess(true);
      setTimeout(() => setCmsSuccess(false), 3000);
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!newCoupon.code.trim()) return;

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Failed to create promo code");
        return;
      }
      setCouponSuccess(`Promo code '${newCoupon.code.toUpperCase()}' created successfully!`);
      setNewCoupon({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "10",
        minOrderValue: "0",
        maxDiscount: "",
        validUntil: "",
        usageLimit: "",
      });
      fetchAllAdminData();
    } catch (err: any) {
      setCouponError(err.message || "Failed to create promo code");
    }
  };

  const handleToggleCouponActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword,
          role: "ADMIN",
        }),
      });
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName) return;
    try {
      await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCampaignName, type: "EMAIL_BLAST" }),
      });
      setNewCampaignName("");
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export Function
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) =>
      Object.values(obj)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sidebarModules = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "collections", label: "Collections", icon: Flame },
    { id: "inventory", label: "Inventory", icon: Layers },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "cms", label: "CMS / Builder", icon: Radio },
    { id: "marketing", label: "Marketing", icon: Flame },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "admins", label: "Admin Users", icon: UserCheck },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "audit", label: "Audit Logs", icon: History },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono">
        INITIALIZING FULL 19-MODULE ADMIN OPERATIONS CENTER...
      </div>
    );
  }

  const kpis = overviewData?.kpis || {};

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col md:flex-row text-[#151515]">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-[#101010] text-[#F5F3EE] border-r border-[#262626] flex-shrink-0 flex flex-col justify-between transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        } hidden md:flex`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-1.5">
                <span className="font-display text-2xl font-black uppercase text-[#F5F3EE]">
                  BUILD<span className="text-[#D8FF36]">.</span>
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#222222] text-[#D8FF36] px-1.5 py-0.5 font-bold">
                  HQ
                </span>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-[#777777] hover:text-[#D8FF36] mx-auto"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <nav className="mt-4 space-y-1 text-xs font-bold uppercase tracking-wider overflow-y-auto max-h-[75vh] pr-1">
            {sidebarModules.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id as AdminModule)}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${
                    activeModule === m.id
                      ? "bg-[#D8FF36] text-[#101010] font-black"
                      : "text-[#AAAAAA] hover:bg-[#181818] hover:text-[#F5F3EE]"
                  }`}
                  title={m.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{m.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#262626]">
          <Link
            href="/"
            className="w-full block text-center py-2 bg-[#181818] text-[#AAAAAA] hover:text-[#D8FF36] text-[11px] font-mono uppercase transition-colors"
          >
            {sidebarCollapsed ? "←" : "← Live Storefront"}
          </Link>
        </div>
      </aside>

      {/* Main Operations Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Navigation */}
        <header className="bg-[#E8E5DE] border-b border-[#D4D0C8] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1 text-[#151515]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers, SKUs, inventory..."
                className="bg-[#F5F3EE] border border-[#D4D0C8] px-3.5 py-1.5 pl-8 text-xs font-mono text-[#151515] placeholder:text-[#777777] w-64 sm:w-80 focus:outline-none focus:border-[#151515]"
              />
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="hidden sm:inline-block text-[#555555]">
              Active: <strong>{user?.name}</strong> ({user?.role})
            </span>
            <span className="bg-[#101010] text-[#D8FF36] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              HQ LIVE
            </span>
          </div>
        </header>

        {/* Content View per Module */}
        <div className="p-6 sm:p-10 space-y-8 flex-1">
          {/* 1. OVERVIEW */}
          {activeModule === "overview" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-[#D4D0C8] gap-4">
                <div>
                  <span className="text-xs font-mono font-bold tracking-mega text-[#777777] uppercase">
                    SECTION 12 • OPERATIONAL RADAR
                  </span>
                  <h1 className="font-display text-4xl uppercase font-black tracking-tight text-[#151515]">
                    BUSINESS OVERVIEW & ANALYTICS
                  </h1>
                </div>
                <button
                  onClick={() => exportToCSV(orders, "orders_ledger")}
                  className="px-4 py-2 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-wider hover:bg-black flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Sales CSV</span>
                </button>
              </div>

              {/* 8 Real KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">TOTAL REVENUE</span>
                  <span className="font-display text-3xl font-black text-[#151515] block mt-1">
                    {formatPrice(kpis.totalRevenue || 0)}
                  </span>
                  <span className="text-[10px] text-green-700 font-bold">100% Verified Settled</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">TOTAL ORDERS</span>
                  <span className="font-display text-3xl font-black text-[#151515] block mt-1">
                    {kpis.totalOrders || 0}
                  </span>
                  <span className="text-[10px] text-[#555555]">All time lifetime orders</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">TOTAL CUSTOMERS</span>
                  <span className="font-display text-3xl font-black text-[#151515] block mt-1">
                    {kpis.totalCustomers || 0}
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold">Registered Members</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">AVERAGE ORDER VALUE</span>
                  <span className="font-display text-3xl font-black text-[#151515] block mt-1">
                    {formatPrice(kpis.averageOrderValue || 0)}
                  </span>
                  <span className="text-[10px] text-[#555555]">AOV per cart checkout</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">PENDING ORDERS</span>
                  <span className="font-display text-3xl font-black text-orange-600 block mt-1">
                    {kpis.pendingOrders || 0}
                  </span>
                  <span className="text-[10px] text-orange-700 font-bold">Awaiting packaging</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">LOW STOCK ALERTS</span>
                  <span className="font-display text-3xl font-black text-red-600 block mt-1">
                    {kpis.lowStockCount || 0}
                  </span>
                  <span className="text-[10px] text-red-600 font-bold">Under 5 units in warehouse</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">TOTAL PRODUCTS</span>
                  <span className="font-display text-3xl font-black text-[#151515] block mt-1">
                    {kpis.totalProducts || 0}
                  </span>
                  <span className="text-[10px] text-[#555555]">Active releases in catalog</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5">
                  <span className="text-[10px] uppercase text-[#777777]">REFUND REQUESTS</span>
                  <span className="font-display text-3xl font-black text-purple-700 block mt-1">
                    {kpis.refundRequests || 0}
                  </span>
                  <span className="text-[10px] text-[#555555]">7-day returns queue</span>
                </div>
              </div>

              {/* Weekly Sales Chart */}
              <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-6 space-y-4">
                <h3 className="font-display text-2xl uppercase font-bold text-[#151515]">
                  DAILY REVENUE VELOCITY (LAST 7 DAYS)
                </h3>
                <div className="grid grid-cols-7 gap-2 pt-4 items-end h-48 border-b border-[#D4D0C8]">
                  {(overviewData?.dailyRevenue || []).map((d: any) => {
                    const maxRev = 60000;
                    const heightPercent = Math.min(100, Math.round((d.revenue / maxRev) * 100));
                    return (
                      <div key={d.day} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#777777] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatPrice(d.revenue)}
                        </span>
                        <div
                          className="w-full bg-[#101010] group-hover:bg-[#D8FF36] transition-all"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-mono font-bold mt-2 text-[#151515]">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS */}
          {activeModule === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  PRODUCT MANAGEMENT ({products.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportToCSV(products, "product_catalog")}
                    className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Streetwear Release
                  </button>
                </div>
              </div>

              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="bg-[#101010] text-[#D8FF36] uppercase font-bold">
                      <th className="p-3">Garment</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Specs (GSM)</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F3EE]">
                        <td className="p-3 font-bold text-[#151515] flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url}
                            alt={p.title}
                            className="w-10 h-12 object-cover bg-white"
                          />
                          <div>
                            <Link href={`/product/${p.slug}`} className="hover:underline">
                              {p.title}
                            </Link>
                            <span className="block text-[10px] text-[#777777]">Slug: {p.slug}</span>
                          </div>
                        </td>
                        <td className="p-3">{p.category?.name || "Streetwear"}</td>
                        <td className="p-3 font-bold">{formatPrice(p.basePrice)}</td>
                        <td className="p-3">{p.gsm} GSM</td>
                        <td className="p-3 font-bold text-amber-800">★ {p.rating} ({p.reviewCount})</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CATEGORIES & 4. COLLECTIONS */}
          {(activeModule === "categories" || activeModule === "collections") && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  {activeModule === "categories" ? "CATEGORIES" : "COLLECTIONS"} MANAGEMENT
                </h2>
              </div>

              {/* Creator Form */}
              <form onSubmit={handleCreateCategory} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 flex gap-3 text-xs font-mono">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={activeModule === "categories" ? "e.g. Acid Wash Crewnecks" : "e.g. CYBER ARCHIVE 2026"}
                  className="flex-1 bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 text-[#151515]"
                />
                <select
                  value={newCategoryType}
                  onChange={(e: any) => setNewCategoryType(e.target.value)}
                  className="bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold"
                >
                  <option value="CATEGORY">Category</option>
                  <option value="COLLECTION">Collection</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#101010] text-[#D8FF36] font-bold uppercase tracking-wider"
                >
                  Create
                </button>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeModule === "categories" ? categories : collections).map((item) => (
                  <div key={item.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex justify-between items-center text-xs font-mono">
                    <div>
                      <strong className="block text-sm text-[#151515] font-bold">{item.name}</strong>
                      <span className="text-[#777777] text-[10px]">Slug: {item.slug}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(item.id, activeModule === "categories" ? "CATEGORY" : "COLLECTION")}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. INVENTORY */}
          {activeModule === "inventory" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  LIVE STOCK & INVENTORY AUDITING
                </h2>
                <button
                  onClick={() => exportToCSV(inventoryVariants, "inventory_stock")}
                  className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Inventory CSV
                </button>
              </div>

              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="bg-[#101010] text-[#D8FF36] uppercase font-bold">
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Color</th>
                      <th className="p-3">Units in Stock</th>
                      <th className="p-3">Audit Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {inventoryVariants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F5F3EE]">
                        <td className="p-3 font-bold text-[#151515]">{v.product?.title}</td>
                        <td className="p-3 text-[#777777]">{v.sku}</td>
                        <td className="p-3 font-bold">{v.size}</td>
                        <td className="p-3">{v.color}</td>
                        <td className="p-3 font-black">
                          <span className={v.stock <= 5 ? "text-red-600 bg-red-100 px-2 py-0.5" : "text-green-700"}>
                            {v.stock} in stock
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(v.id, Math.max(0, v.stock - 5))}
                            className="px-2 py-1 bg-[#F5F3EE] border border-[#D4D0C8] hover:bg-black hover:text-white"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateStock(v.id, v.stock + 10)}
                            className="px-2 py-1 bg-[#101010] text-[#D8FF36] hover:bg-black"
                          >
                            +10 Units
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. ORDERS & 9. RETURNS */}
          {(activeModule === "orders" || activeModule === "returns") && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  {activeModule === "orders" ? "ORDERS MANAGEMENT" : "RETURNS & REFUNDS QUEUE"}
                </h2>
                <button
                  onClick={() => exportToCSV(orders, "orders_master")}
                  className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Orders CSV
                </button>
              </div>

              <div className="space-y-4">
                {orders
                  .filter((o) => activeModule !== "returns" || o.status === "RETURN_REQUESTED")
                  .map((o) => (
                    <div key={o.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-3 font-mono text-xs">
                      <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-[#D4D0C8]">
                        <div>
                          <strong className="text-base text-[#151515]">{o.orderNumber}</strong>
                          <span className="text-[#777777] ml-3">{new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <span className="px-2 py-0.5 bg-[#101010] text-[#D8FF36] font-bold">
                            {o.status}
                          </span>
                          <span className="px-2 py-0.5 bg-[#F5F3EE] font-bold">
                            {formatPrice(o.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {o.items?.map((it: any) => (
                          <div key={it.id} className="flex justify-between">
                            <span>{it.productTitle} ({it.variantSize})</span>
                            <span>Qty: {it.quantity} • {formatPrice(it.total)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#D4D0C8] flex flex-wrap gap-2 items-center">
                        <span className="text-[#777777]">ADVANCE STATUS:</span>
                        {["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(o.id, st)}
                            className="px-2 py-1 bg-[#F5F3EE] border hover:bg-black hover:text-[#D8FF36] font-bold"
                          >
                            → {st}
                          </button>
                        ))}
                        <Link
                          href={`/order-success/${o.orderNumber}`}
                          className="ml-auto underline font-bold text-blue-700"
                        >
                          Print Invoice
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 7. CUSTOMERS */}
          {activeModule === "customers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  REGISTERED CUSTOMERS ({customers.length})
                </h2>
                <button
                  onClick={() => exportToCSV(customers, "customers_roster")}
                  className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Customers CSV
                </button>
              </div>

              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="bg-[#101010] text-[#D8FF36] uppercase font-bold">
                      <th className="p-3">Customer</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Orders</th>
                      <th className="p-3">Total Spent</th>
                      <th className="p-3">Member Since</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F5F3EE]">
                        <td className="p-3 font-bold text-[#151515]">{c.name}</td>
                        <td className="p-3">{c.email} • {c.phone}</td>
                        <td className="p-3">{c.location}</td>
                        <td className="p-3 font-bold">{c.ordersCount} drops</td>
                        <td className="p-3 font-black text-green-800">{formatPrice(c.totalSpent)}</td>
                        <td className="p-3 text-[#777777]">{new Date(c.joinedDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. PAYMENTS */}
          {activeModule === "payments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  PAYMENT TRANSACTIONS & SETTLEMENTS
                </h2>
                <button
                  onClick={() => exportToCSV(payments, "payments_ledger")}
                  className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Payments CSV
                </button>
              </div>

              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="bg-[#101010] text-[#D8FF36] uppercase font-bold">
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Transaction Ref</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F3EE]">
                        <td className="p-3 font-bold">{p.orderNumber}</td>
                        <td className="p-3">{p.customerEmail}</td>
                        <td className="p-3 font-bold">{p.method}</td>
                        <td className="p-3 text-[#777777]">{p.transactionId}</td>
                        <td className="p-3 font-black">{formatPrice(p.amount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 font-bold ${p.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. SHIPPING */}
          {activeModule === "shipping" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  LOGISTICS & COURIER ASSIGNMENT
                </h2>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <strong className="text-sm font-bold text-[#151515]">{o.orderNumber}</strong>
                      <p className="text-[#777777]">Courier: {o.courierName || "Delhivery"} • AWB: {o.trackingNumber || "Pending"}</p>
                    </div>
                    <button
                      onClick={() => {
                        const randomAwb = `DLHV-${Math.floor(10000000 + Math.random() * 90000000)}`;
                        handleUpdateOrderStatus(o.id, "SHIPPED", randomAwb, "Delhivery Express");
                      }}
                      className="px-4 py-2 bg-[#101010] text-[#D8FF36] font-bold uppercase hover:bg-black"
                    >
                      Assign Delhivery AWB & Mark Shipped
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. COUPONS & PROMOTIONS */}
          {activeModule === "coupons" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <div>
                  <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                    DISCOUNTS &amp; PROMO CODES
                  </h2>
                  <p className="text-xs font-mono text-[#777777] mt-1">
                    Manage active customer promotional codes, percentage discounts, fixed savings, and usage limits.
                  </p>
                </div>
              </div>

              {/* Create Promo Code Form */}
              <form onSubmit={handleCreateCoupon} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-4 text-xs font-mono">
                <div className="font-bold uppercase text-[#151515] text-sm">
                  + CREATE NEW PROMOTIONAL CODE
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">COUPON CODE *</label>
                    <input
                      type="text"
                      required
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                      placeholder="e.g. SURAJ300"
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 uppercase font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">DISCOUNT TYPE *</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    >
                      <option value="PERCENTAGE">PERCENTAGE (%)</option>
                      <option value="FIXED">FIXED AMOUNT (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">
                      {newCoupon.discountType === "PERCENTAGE" ? "DISCOUNT % *" : "DISCOUNT AMOUNT (₹) *"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={newCoupon.discountType === "PERCENTAGE" ? "100" : "100000"}
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                      placeholder={newCoupon.discountType === "PERCENTAGE" ? "50" : "100"}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">MIN ORDER AMOUNT (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.minOrderValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">MAX DISCOUNT CAP (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                      placeholder="Optional cap for % discounts"
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">TOTAL USAGE LIMIT</label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                      placeholder="Unlimited if empty"
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-bold">EXPIRATION DATE</label>
                    <input
                      type="date"
                      value={newCoupon.validUntil}
                      onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 font-bold text-[#151515] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#101010] text-[#D8FF36] hover:bg-black font-bold uppercase tracking-wider transition-colors"
                    >
                      Create Promo Code
                    </button>
                  </div>
                </div>

                {couponError && (
                  <div className="p-2 bg-red-100 border border-red-300 text-red-700 font-bold">
                    {couponError}
                  </div>
                )}
                {couponSuccess && (
                  <div className="p-2 bg-green-100 border border-green-300 text-green-800 font-bold">
                    {couponSuccess}
                  </div>
                )}
              </form>

              {/* Promo Codes Table */}
              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#D4D0C8] text-[#151515] uppercase">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Min Order</th>
                      <th className="p-3">Max Cap</th>
                      <th className="p-3">Usage</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F5F3EE]/50 transition-colors">
                        <td className="p-3 font-bold text-sm text-[#151515]">
                          <span className="bg-[#151515] text-[#D8FF36] px-2 py-0.5">
                            {c.code}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-green-700">
                          {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`}
                        </td>
                        <td className="p-3 text-[#666666]">
                          {c.minOrderValue > 0 ? `₹${c.minOrderValue}` : "No Minimum"}
                        </td>
                        <td className="p-3 text-[#666666]">
                          {c.maxDiscount ? `₹${c.maxDiscount}` : "None"}
                        </td>
                        <td className="p-3 text-[#666666]">
                          {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : "uses"}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleCouponActive(c.id, c.isActive)}
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors ${
                              c.isActive
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                            title="Click to toggle active status"
                          >
                            {c.isActive ? "ACTIVE" : "INACTIVE"}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="p-1 text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. REVIEWS */}
          {activeModule === "reviews" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  REVIEWS & RATINGS MODERATION
                </h2>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[#151515]">{r.userName}</strong>
                        <span className="text-amber-800 font-bold">★ {r.rating} / 5</span>
                        <span className="text-[#777777]">on {r.product?.title}</span>
                      </div>
                      <p className="mt-1 text-[#333333]">{r.comment}</p>
                    </div>
                    <button onClick={() => handleDeleteReview(r.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. CMS / BUILDER */}
          {activeModule === "cms" && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  CMS / WEBSITE CONTENT BUILDER
                </h2>
              </div>
              {cmsSuccess && (
                <div className="p-3 bg-green-100 text-green-800 font-mono text-xs font-bold">
                  CMS published to storefront!
                </div>
              )}
              <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Infinite Typography Marquee</label>
                  <textarea
                    rows={2}
                    value={marqueeInput}
                    onChange={(e) => setMarqueeInput(e.target.value)}
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Next Drop Title</label>
                  <input
                    type="text"
                    value={dropTitle}
                    onChange={(e) => setDropTitle(e.target.value)}
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Launch Date</label>
                  <input
                    type="date"
                    value={dropTargetDate}
                    onChange={(e) => setDropTargetDate(e.target.value)}
                    className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                  />
                </div>
                <button
                  onClick={handleSaveCMS}
                  className="px-6 py-3 bg-[#101010] text-[#D8FF36] font-bold uppercase tracking-wider"
                >
                  Publish to Storefront
                </button>
              </div>
            </div>
          )}

          {/* 13. MARKETING */}
          {activeModule === "marketing" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  MARKETING & VIP DROP BROADCASTS
                </h2>
              </div>
              <form onSubmit={handleCreateCampaign} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 flex gap-3 text-xs font-mono">
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="Campaign Title (e.g. VIP 15-Min Priority Blast)"
                  className="flex-1 bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2"
                />
                <button type="submit" className="px-5 py-2 bg-[#101010] text-[#D8FF36] font-bold uppercase">
                  Dispatch Broadcast
                </button>
              </form>
              <div className="space-y-3 font-mono text-xs">
                {marketingData.campaigns?.map((camp: any) => (
                  <div key={camp.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex justify-between items-center">
                    <div>
                      <strong className="block text-sm text-[#151515]">{camp.name}</strong>
                      <span className="text-[#777777]">{camp.type} • {camp.recipientCount} Recipients</span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold uppercase">
                      {camp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. ANALYTICS */}
          {activeModule === "analytics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  DEEP REVENUE & CATALOG ANALYTICS
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-3">
                  <h3 className="font-display text-xl uppercase font-bold text-[#151515]">
                    BESTSELLING RELEASES (UNITS SOLD)
                  </h3>
                  <div className="space-y-2">
                    {(overviewData?.bestsellers || []).map((b: any, idx: number) => (
                      <div key={b.id} className="flex justify-between items-center py-1 border-b border-[#D4D0C8]">
                        <span>#{idx + 1} {b.title}</span>
                        <strong className="text-[#151515]">{b.unitsSold} units ({formatPrice(b.revenue)})</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-3">
                  <h3 className="font-display text-xl uppercase font-bold text-[#151515]">
                    REVENUE SHARE BY CATEGORY
                  </h3>
                  <div className="space-y-2">
                    {(overviewData?.categoryRevenue || []).map((cat: any) => (
                      <div key={cat.name} className="flex justify-between items-center py-1 border-b border-[#D4D0C8]">
                        <span>{cat.name}</span>
                        <strong className="text-green-800">{formatPrice(cat.revenue)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 15. NOTIFICATIONS */}
          {activeModule === "notifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  OPERATIONAL NOTIFICATIONS QUEUE
                </h2>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span>Order BLD-2505-8821 verified and delivered via Delhivery</span>
                  </div>
                  <span className="text-[#777777]">10 mins ago</span>
                </div>
                <div className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Low stock warning on NEO-WASH-XL (only 4 units remaining)</span>
                  </div>
                  <span className="text-[#777777]">45 mins ago</span>
                </div>
              </div>
            </div>
          )}

          {/* 16. ADMIN USERS */}
          {activeModule === "admins" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  ADMIN USERS & ACCESS CONTROL
                </h2>
              </div>
              <form onSubmit={handleCreateAdmin} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 flex flex-wrap gap-3 text-xs font-mono">
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Full Name"
                  className="bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 flex-1"
                />
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 flex-1"
                />
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-[#F5F3EE] border border-[#D4D0C8] px-3 py-2 w-36"
                />
                <button type="submit" className="px-5 py-2 bg-[#101010] text-[#D8FF36] font-bold uppercase">
                  Invite Admin
                </button>
              </form>
              <div className="space-y-3 font-mono text-xs">
                {admins.map((adm) => (
                  <div key={adm.id} className="bg-[#E8E5DE] border border-[#D4D0C8] p-4 flex justify-between items-center">
                    <div>
                      <strong className="block text-sm text-[#151515] font-bold">{adm.name}</strong>
                      <span className="text-[#777777]">{adm.email}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#101010] text-[#D8FF36] font-bold text-[10px]">
                      {adm.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 17. SETTINGS */}
          {activeModule === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  STORE OPERATIONS SETTINGS
                </h2>
              </div>
              {settingsSaved && (
                <div className="p-3 bg-green-100 text-green-800 font-mono text-xs font-bold">
                  Settings updated across storefront and checkout services!
                </div>
              )}
              <form onSubmit={handleSaveSettings} className="bg-[#E8E5DE] border border-[#D4D0C8] p-5 space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Currency</label>
                    <input
                      type="text"
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5 font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Support Phone</label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Free Shipping (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[#555555] uppercase mb-1">Return Window (Days)</label>
                    <input
                      type="number"
                      value={settings.returnWindowDays}
                      onChange={(e) => setSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
                      className="w-full bg-[#F5F3EE] border border-[#D4D0C8] p-2.5"
                    />
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-[#101010] text-[#D8FF36] font-bold uppercase tracking-wider">
                  Save Store Configuration
                </button>
              </form>
            </div>
          )}

          {/* 18. AUDIT LOGS */}
          {activeModule === "audit" && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline pb-4 border-b border-[#D4D0C8]">
                <h2 className="font-display text-3xl uppercase font-black text-[#151515]">
                  ADMINISTRATIVE AUDIT TRAILS
                </h2>
                <button
                  onClick={() => exportToCSV(auditLogs, "audit_trails")}
                  className="px-3 py-2 bg-[#E8E5DE] border border-[#151515] text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Audit CSV
                </button>
              </div>

              <div className="bg-[#E8E5DE] border border-[#D4D0C8] overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="bg-[#101010] text-[#D8FF36] uppercase font-bold">
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Activity Description</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4D0C8]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F5F3EE]">
                        <td className="p-3 font-bold text-[#151515]">{log.action}</td>
                        <td className="p-3 text-[#777777]">{log.entity}</td>
                        <td className="p-3">{log.details}</td>
                        <td className="p-3 font-bold">{log.adminName}</td>
                        <td className="p-3 text-[#777777]">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#F5F3EE] border-2 border-[#151515] w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D4D0C8]">
              <h3 className="font-display text-2xl uppercase font-bold text-[#151515]">
                ADD NEW STREETWEAR RELEASE
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-xs font-bold uppercase underline"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#555555] uppercase mb-1">T-Shirt Name / Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. CYBER ARCHIVE 260 GSM OVERSIZED TEE"
                  className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">T-Shirt Category *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Fit Type *</label>
                  <select
                    value={newProduct.fit}
                    onChange={(e) => setNewProduct({ ...newProduct, fit: e.target.value })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  >
                    <option value="Oversized Boxy Fit">Oversized Boxy Fit</option>
                    <option value="Tokyo Drop-Shoulder">Tokyo Drop-Shoulder</option>
                    <option value="Regular Street Fit">Regular Street Fit</option>
                    <option value="Relaxed Boxy Fit">Relaxed Boxy Fit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Fabric Type *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    placeholder="e.g. 100% Combed Ringspun Cotton"
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Fabric GSM (Weight) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.gsm}
                    onChange={(e) => setNewProduct({ ...newProduct, gsm: Number(e.target.value) })}
                    placeholder="e.g. 260"
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Print Type</label>
                  <select
                    value={newProduct.printType}
                    onChange={(e) => setNewProduct({ ...newProduct, printType: e.target.value })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  >
                    <option value="High-Density Screen Print">High-Density Screen Print</option>
                    <option value="Tactile 3D Rubber Ink">Tactile 3D Rubber Ink</option>
                    <option value="1200 DPI Kornit DTG">1200 DPI Kornit DTG</option>
                    <option value="Acid Wash Discharge Print">Acid Wash Discharge Print</option>
                    <option value="Tactile Puff Ink">Tactile Puff Ink</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Print Placement</label>
                  <select
                    value={newProduct.printPlacement}
                    onChange={(e) => setNewProduct({ ...newProduct, printPlacement: e.target.value })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  >
                    <option value="Chest & Full Back">Chest & Full Back</option>
                    <option value="Front Chest Only">Front Chest Only</option>
                    <option value="Full Back Only">Full Back Only</option>
                    <option value="Sleeve & Hem Subtle">Sleeve & Hem Subtle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Artwork Title / Reference</label>
                  <input
                    type="text"
                    value={newProduct.artwork}
                    onChange={(e) => setNewProduct({ ...newProduct, artwork: e.target.value })}
                    placeholder="e.g. Cyber Ronin V4 Vector"
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Color Name & Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProduct.colorName}
                      onChange={(e) => setNewProduct({ ...newProduct, colorName: e.target.value })}
                      placeholder="e.g. Washed Black"
                      className="w-2/3 bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                    />
                    <input
                      type="color"
                      value={newProduct.colorHex}
                      onChange={(e) => setNewProduct({ ...newProduct, colorHex: e.target.value })}
                      className="w-1/3 h-10 bg-[#E8E5DE] border border-[#D4D0C8] p-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Selling Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Original Price (INR)</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
                <div>
                  <label className="block text-[#555555] uppercase mb-1">Stock per Size (S-XXL)</label>
                  <input
                    type="number"
                    value={newProduct.initialStock}
                    onChange={(e) => setNewProduct({ ...newProduct, initialStock: Number(e.target.value) })}
                    className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#555555] uppercase mb-1">High-Res Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                />
              </div>

              <div>
                <label className="block text-[#555555] uppercase mb-1">T-Shirt Description & Specs</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Detailed fabric specs, wash treatment, drop shoulder details, collar ribbing..."
                  className="w-full bg-[#E8E5DE] border border-[#D4D0C8] p-2.5 text-[#151515]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#101010] text-[#D8FF36] font-bold text-xs uppercase tracking-widest hover:bg-black"
                >
                  Publish T-Shirt Immediately
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-6 py-3 border border-[#151515] text-xs font-bold uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
