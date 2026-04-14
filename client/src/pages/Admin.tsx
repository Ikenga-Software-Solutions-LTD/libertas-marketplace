import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState("products");
  const [showProductDialog, setShowProductDialog] = useState(false);

  // Mock data - replace with tRPC calls
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      price: 12999,
      category: "Gadgets",
      supplier: "TechCorp",
      stock: 15,
    },
    {
      id: 2,
      name: "Heirloom Tomato Seeds",
      price: 499,
      category: "Seeds",
      supplier: "AgriPrime",
      stock: 50,
    },
  ]);

  const [affiliateApplications] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      appliedDate: "2024-03-10",
      status: "pending",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      appliedDate: "2024-03-08",
      status: "pending",
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      appliedDate: "2024-03-05",
      status: "pending",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Gadgets",
    supplier: "",
    stock: "",
    imageUrl: "",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container flex items-center justify-center py-20">
          <Card className="max-w-md p-8 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold">Access Denied</h2>
            <p className="mb-6 text-muted-foreground">
              You do not have permission to access the admin panel.
            </p>
            <Link href="/">
              <a className="inline-block">
                <Button>Return to Catalog</Button>
              </a>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newProduct = {
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      supplier: formData.supplier,
      stock: parseInt(formData.stock) || 0,
    };

    setProducts([...products, newProduct]);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Gadgets",
      supplier: "",
      stock: "",
      imageUrl: "",
    });
    setShowProductDialog(false);
    toast.success("Product added successfully!");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully!");
  };

  const handleApproveAffiliate = (id: number) => {
    toast.success("Affiliate application approved!");
  };

  const handleRejectAffiliate = (id: number) => {
    toast.error("Affiliate application rejected!");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav cartCount={totalItems} />

      <main className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground">Manage products and affiliates</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliate Applications</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Add Product Button */}
            <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the product details below
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₦) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleFormChange}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleFormChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-border bg-input px-3 py-2"
                      >
                        <option value="Gadgets">Gadgets</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Tools">Tools</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier *</Label>
                      <Input
                        id="supplier"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleFormChange}
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Products List */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Category</th>
                    <th className="px-4 py-2 text-left font-semibold">Supplier</th>
                    <th className="px-4 py-2 text-right font-semibold">Price</th>
                    <th className="px-4 py-2 text-right font-semibold">Stock</th>
                    <th className="px-4 py-2 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{product.supplier}</td>
                      <td className="px-4 py-3 text-right">
                        ₦{(product.price / 100).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">{product.stock}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Applied Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliateApplications.map((app) => (
                    <tr key={app.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{app.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.email}</td>
                      <td className="px-4 py-3">{app.appliedDate}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2 py-1 text-xs font-semibold text-warning">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveAffiliate(app.id)}
                            className="text-success hover:text-success"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectAffiliate(app.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
