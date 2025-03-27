"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StripeProvider } from "@/components/subscription/StripeProvider"
import { PaymentForm } from "@/components/subscription/PaymentForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'
import { useStripePayment } from '@/hooks/use-stripe-payment'

const PRICES = {
  monthly: {
    admin: 29.99,
    user: 3.99,
  },
  yearly: {
    admin: 29.99 * 12, // Regular yearly price (will apply coupon at checkout)
    user: 3.99 * 12,   // Regular yearly price (will apply coupon at checkout)
  },
}

const YEARLY_DISCOUNT_RATE = 0.15; // 15% discount

export default function OrganizationSignupPage() {
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [orgName, setOrgName] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminLicenses, setAdminLicenses] = useState(1)
  const [userLicenses, setUserLicenses] = useState(5)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [customAdminLicenses, setCustomAdminLicenses] = useState('')
  const [customUserLicenses, setCustomUserLicenses] = useState('')
  const [isCustomAdminLicenses, setIsCustomAdminLicenses] = useState(false)
  const [isCustomUserLicenses, setIsCustomUserLicenses] = useState(false)

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  }

  const calculateDiscountedPrice = (price) => {
    if (billingPeriod === 'yearly') {
      const discountAmount = price * YEARLY_DISCOUNT_RATE;
      const discountedPrice = price - discountAmount;
      return discountedPrice;
    }
    return price;
  }

  const adminPrice = PRICES[billingPeriod].admin;
  const userPrice = PRICES[billingPeriod].user;
  
  const adminCount = adminLicenses || 0;
  const userCount = userLicenses || 0;
  const subtotal = adminCount * adminPrice + userCount * userPrice;
  const discount = billingPeriod === 'yearly' ? subtotal * YEARLY_DISCOUNT_RATE : 0;
  const totalPrice = (subtotal - discount).toFixed(2);
  const monthlyEquivalent = billingPeriod === 'yearly' 
    ? (parseFloat(totalPrice) / 12).toFixed(2) 
    : totalPrice;

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Create setup intent to get client secret
      const response = await fetch('/api/payment/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to create setup intent')
      }
      
      const data = await response.json()
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not prepare payment form. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsLoading(true)

    try {
      // Create organization and subscription
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orgName,
          adminName,
          adminEmail,
          adminLicenses,
          userLicenses,
          billingPeriod,
          paymentMethodId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create organization')
      }

      toast({
        title: 'Organization Created',
        description: 'Welcome to SimpleReimbursement! Check your email for next steps.',
      })

      router.push('/admin/setup')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create organization. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentError = (error: Error) => {
    toast({
      title: 'Payment Error',
      description: error.message,
      variant: 'destructive',
    })
  }

  const handleAdminLicenseChange = (value) => {
    if (value === 'custom') {
      setIsCustomAdminLicenses(true)
      setCustomAdminLicenses('')
      setAdminLicenses(0)
    } else {
      setIsCustomAdminLicenses(false)
      setAdminLicenses(parseInt(value))
      setCustomAdminLicenses('')
    }
  }

  const handleUserLicenseChange = (value) => {
    if (value === 'custom') {
      setIsCustomUserLicenses(true)
      setCustomUserLicenses('')
      setUserLicenses(0)
    } else {
      setIsCustomUserLicenses(false)
      setUserLicenses(parseInt(value))
      setCustomUserLicenses('')
    }
  }

  const handleCustomAdminLicenseChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomAdminLicenses(value)
      if (value) {
        setAdminLicenses(parseInt(value))
      } else {
        setAdminLicenses(0)
      }
    }
  }

  const handleCustomUserLicenseChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomUserLicenses(value)
      if (value) {
        setUserLicenses(parseInt(value))
      } else {
        setUserLicenses(0)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Set Up Your Organization</CardTitle>
          <CardDescription>
            Create your organization account and start managing expense reimbursements efficiently
          </CardDescription>
        </CardHeader>

        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" disabled={step === 'payment'}>
              Organization Details
            </TabsTrigger>
            <TabsTrigger value="payment" disabled={step === 'details'}>
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={handleDetailsSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>The name of your company or organization that will appear on all reports and documents.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="orgName"
                      placeholder="Acme Inc."
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="adminName">Admin Name</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>The name of the primary administrator who will manage the organization account.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="adminName"
                        placeholder="John Doe"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>This email will be used for the admin account login and important notifications.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@company.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2">
                      <Label>Billing Period</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Choose between monthly billing or save 10% with annual billing.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <RadioGroup 
                      value={billingPeriod} 
                      onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly billing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly">Yearly billing (save 15%)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <h3 className="text-lg font-medium mb-2">License Selection</h3>
                  
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="adminLicenses">
                        Admin Licenses ({formatPrice(adminPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'} each)
                        {billingPeriod === 'yearly' && (
                          <span className="ml-1 text-sm text-green-600">
                            (15% off: {formatPrice(adminPrice * (1 - YEARLY_DISCOUNT_RATE))}/year)
                          </span>
                        )}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Admin licenses are for team members who need to manage expense approvals, configure policies, and oversee the system.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2">
                      <Select 
                        value={isCustomAdminLicenses ? 'custom' : adminLicenses.toString()} 
                        onValueChange={handleAdminLicenseChange}
                      >
                        <SelectTrigger id="adminLicenses" className={isCustomAdminLicenses ? "w-1/2" : "w-full"}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Admin ({formatPrice(adminPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="2">2 Admins ({formatPrice(adminPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="3">3 Admins ({formatPrice(adminPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="5">5 Admins ({formatPrice(adminPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="custom">Custom amount...</SelectItem>
                        </SelectContent>
                      </Select>
                      {isCustomAdminLicenses && (
                        <div className="w-1/2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={customAdminLicenses}
                            onChange={handleCustomAdminLicenseChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="userLicenses">
                        User Licenses ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'} each)
                        {billingPeriod === 'yearly' && (
                          <span className="ml-1 text-sm text-green-600">
                            (15% off: {formatPrice(userPrice * (1 - YEARLY_DISCOUNT_RATE))}/year)
                          </span>
                        )}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>User licenses are for employees who will submit expenses for reimbursement.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2">
                      <Select 
                        value={isCustomUserLicenses ? 'custom' : userLicenses.toString()} 
                        onValueChange={handleUserLicenseChange}
                      >
                        <SelectTrigger id="userLicenses" className={isCustomUserLicenses ? "w-1/2" : "w-full"}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Users ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="10">10 Users ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="20">20 Users ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="50">50 Users ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="100">100 Users ({formatPrice(userPrice)}/{billingPeriod === 'monthly' ? 'month' : 'year'})</SelectItem>
                          <SelectItem value="custom">Custom amount...</SelectItem>
                        </SelectContent>
                      </Select>
                      {isCustomUserLicenses && (
                        <div className="w-1/2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={customUserLicenses}
                            onChange={handleCustomUserLicenseChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-medium">Total {billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Cost:</p>
                        {billingPeriod === 'yearly' && discount > 0 ? (
                          <div className="text-right">
                            <p className="text-lg line-through text-muted-foreground">{formatPrice(subtotal)}</p>
                            <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
                        )}
                      </div>
                      
                      {billingPeriod === 'yearly' && (
                        <div className="flex justify-between text-sm text-green-600">
                          <p>15% yearly discount:</p>
                          <p>-{formatPrice(discount)}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-muted-foreground">
                        <p>Monthly equivalent:</p>
                        <p>{formatPrice(monthlyEquivalent)}/month</p>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">
                        Billed {billingPeriod === 'monthly' ? 'monthly' : 'annually'}. Cancel or change your plan at any time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400">For Finance Administrators</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    As an admin, you'll be able to invite users to your organization, manage expense approvals, 
                    and configure reimbursement policies. User licenses are for employees who will submit expenses.
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Preparing Payment..." : "Continue to Payment"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="payment">
            <CardContent className="space-y-4">
              {clientSecret ? (
                <StripeProvider options={{ clientSecret, appearance: { theme: 'flat' } }}>
                  <PaymentForm
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </StripeProvider>
              ) : (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 