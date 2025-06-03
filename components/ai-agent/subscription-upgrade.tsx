"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Crown, Zap, Brain, Users, Star, ArrowRight, Sparkles } from "lucide-react"
import { aiAgentService } from "@/lib/ai-agent-service"
import { cn } from "@/lib/utils"

interface SubscriptionUpgradeProps {
  currentTier: "free" | "premium" | "enterprise"
  onUpgrade: (tier: string, plan: string) => void
}

export function SubscriptionUpgrade({ currentTier, onUpgrade }: SubscriptionUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly")
  const [loading, setLoading] = useState(false)

  const freeFeatures = aiAgentService.getSubscriptionFeatures("free")
  const premiumFeatures = aiAgentService.getSubscriptionFeatures("premium")
  const enterpriseFeatures = aiAgentService.getSubscriptionFeatures("enterprise")

  const pricingPlans = {
    free: {
      name: "Starter",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Get started with basic AI guidance",
      features: freeFeatures.features,
      limitations: ["3 nudges per day", "No AI coaching", "Basic analytics only"],
      popular: false,
    },
    premium: {
      name: "Pro",
      monthlyPrice: 14.99,
      annualPrice: 149.99,
      description: "Full AI coaching and unlimited insights",
      features: premiumFeatures.features,
      limitations: [],
      popular: true,
    },
    enterprise: {
      name: "Enterprise",
      monthlyPrice: 199,
      annualPrice: 1999,
      description: "For teams and organizations",
      features: enterpriseFeatures.features,
      limitations: [],
      popular: false,
    },
  }

  const handleUpgrade = async (tier: string) => {
    setLoading(true)
    try {
      await onUpgrade(tier, selectedPlan)
    } catch (error) {
      console.error("Upgrade failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAnnualSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12
    const savings = monthlyCost - annual
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-forest-600" />
          <h2 className="text-3xl font-bold text-forest-800">Unlock Your Full Potential</h2>
        </div>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Upgrade to get unlimited AI coaching, personalized insights, and advanced features to accelerate your
          transformation
        </p>
      </div>

      {/* Current Plan Banner */}
      {currentTier !== "free" && (
        <Card className="border-forest-200 bg-forest-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-forest-800">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">You're currently on the {pricingPlans[currentTier].name} plan</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <Tabs value={selectedPlan} onValueChange={(value: any) => setSelectedPlan(value)}>
          <TabsList className="bg-forest-100">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="annual" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 17%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(pricingPlans).map(([tier, plan]) => {
          const isCurrentPlan = tier === currentTier
          const price = selectedPlan === "monthly" ? plan.monthlyPrice : plan.annualPrice
          const billingCycle = selectedPlan === "monthly" ? "/month" : "/year"

          const savings =
            selectedPlan === "annual" && plan.annualPrice > 0
              ? getAnnualSavings(plan.monthlyPrice, plan.annualPrice)
              : null

          return (
            <Card
              key={tier}
              className={cn(
                "relative transition-all duration-200",
                plan.popular && "border-forest-400 shadow-lg scale-105",
                isCurrentPlan && "border-green-400 bg-green-50/50",
                !plan.popular && !isCurrentPlan && "border-forest-200",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-forest-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-forest-800 flex items-center justify-center gap-2">
                  {tier === "free" && <Zap className="h-5 w-5" />}
                  {tier === "premium" && <Brain className="h-5 w-5" />}
                  {tier === "enterprise" && <Users className="h-5 w-5" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="py-4">
                  <div className="text-4xl font-bold text-forest-800">
                    ${price}
                    <span className="text-lg font-normal text-stone-600">{billingCycle}</span>
                  </div>
                  {savings && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${savings.amount}/year ({savings.percentage}% off)
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-stone-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="pt-3 border-t border-stone-200">
                    <p className="text-xs text-stone-500 mb-2">Limitations:</p>
                    {plan.limitations.map((limitation, index) => (
                      <p key={index} className="text-xs text-stone-500">
                        • {limitation}
                      </p>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full" variant="outline">
                      Current Plan
                    </Button>
                  ) : tier === "free" ? (
                    <Button variant="outline" className="w-full border-forest-300 text-forest-600" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(tier)}
                      disabled={loading}
                      className={cn(
                        "w-full",
                        plan.popular
                          ? "bg-forest-600 text-white hover:bg-forest-700"
                          : "border-forest-300 text-forest-600 hover:bg-forest-50",
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {loading ? "Processing..." : tier === "premium" ? "Upgrade to Pro" : "Contact Sales"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enterprise Contact */}
      <Card className="border-forest-200 bg-gradient-to-r from-forest-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-forest-800 mb-2">Need a Custom Solution?</h3>
          <p className="text-stone-600 mb-4">
            Contact our team for custom enterprise pricing, integrations, and dedicated support.
          </p>
          <Button variant="outline" className="border-forest-300 text-forest-600 hover:bg-forest-50">
            Contact Sales Team
          </Button>
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card className="border-forest-200">
        <CardHeader>
          <CardTitle className="text-forest-800">Feature Comparison</CardTitle>
          <CardDescription>See what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 text-forest-800">Feature</th>
                  <th className="text-center py-3 text-forest-800">Starter</th>
                  <th className="text-center py-3 text-forest-800">Pro</th>
                  <th className="text-center py-3 text-forest-800">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="py-3 text-stone-700">Daily AI Nudges</td>
                  <td className="text-center py-3">3 per day</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">AI Coaching Sessions</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">4 per month</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">Advanced Analytics</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">Calendar Integration</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-stone-700">Team Management</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
