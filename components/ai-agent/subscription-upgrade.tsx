"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Users, Zap, MessageSquare, TrendingUp, Calendar, Shield } from "lucide-react"
import { aiAgentService } from "@/lib/ai-agent-service"

interface SubscriptionUpgradeProps {
  currentTier: "free" | "premium" | "enterprise"
  onUpgrade: (tier: string, plan: string) => void
}

export function SubscriptionUpgrade({ currentTier, onUpgrade }: SubscriptionUpgradeProps) {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started with AI-powered personal development",
      features: aiAgentService.getSubscriptionFeatures("free"),
      icon: Zap,
      color: "border-stone-200",
      buttonText: "Current Plan",
      disabled: currentTier === "free",
    },
    {
      id: "premium",
      name: "Premium",
      price: 14.99,
      period: "month",
      yearlyPrice: 149.99,
      description: "Unlock the full power of AI coaching and personalized insights",
      features: aiAgentService.getSubscriptionFeatures("premium"),
      icon: Crown,
      color: "border-forest-300 ring-2 ring-forest-200",
      buttonText: currentTier === "premium" ? "Current Plan" : "Upgrade to Premium",
      disabled: currentTier === "premium",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      period: "month",
      description: "Advanced features for teams and organizations",
      features: aiAgentService.getSubscriptionFeatures("enterprise"),
      icon: Users,
      color: "border-blue-300",
      buttonText: currentTier === "enterprise" ? "Current Plan" : "Contact Sales",
      disabled: currentTier === "enterprise",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-forest-800">Choose Your Plan</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Unlock the full potential of AI-powered personal development with advanced coaching, unlimited nudges, and
          deep insights.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const PlanIcon = plan.icon

          return (
            <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? "scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-forest-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-forest-100 rounded-full">
                    <PlanIcon className="h-8 w-8 text-forest-600" />
                  </div>
                </div>

                <CardTitle className="text-2xl text-forest-800">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="space-y-2">
                  <div className="text-4xl font-bold text-forest-800">
                    ${plan.price}
                    <span className="text-lg font-normal text-stone-600">/{plan.period}</span>
                  </div>

                  {plan.yearlyPrice && (
                    <div className="text-sm text-stone-600">or ${plan.yearlyPrice}/year (save 17%)</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-forest-800 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    What's Included:
                  </h4>

                  <ul className="space-y-2">
                    {plan.features.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-600">
                      {plan.features.nudgesPerDay === -1 ? "∞" : plan.features.nudgesPerDay}
                    </div>
                    <div className="text-xs text-stone-600">Daily Nudges</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-600">
                      {plan.features.aiCoachingSessions === -1 ? "∞" : plan.features.aiCoachingSessions}
                    </div>
                    <div className="text-xs text-stone-600">AI Sessions</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onUpgrade(plan.id, "monthly")}
                  disabled={plan.disabled}
                  className={`w-full ${
                    plan.popular
                      ? "bg-forest-600 text-white hover:bg-forest-700"
                      : "border-forest-300 text-forest-600 hover:bg-forest-50"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>

                {plan.id === "premium" && !plan.disabled && (
                  <Button
                    onClick={() => onUpgrade(plan.id, "yearly")}
                    variant="outline"
                    className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
                  >
                    Choose Yearly (Save 17%)
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <Card className="border-forest-200">
        <CardHeader>
          <CardTitle className="text-forest-800">Feature Comparison</CardTitle>
          <CardDescription>See what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 text-forest-800">Feature</th>
                  <th className="text-center py-3 text-forest-800">Free</th>
                  <th className="text-center py-3 text-forest-800">Premium</th>
                  <th className="text-center py-3 text-forest-800">Enterprise</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-stone-100">
                  <td className="py-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-forest-600" />
                    Daily AI Nudges
                  </td>
                  <td className="text-center py-3">3</td>
                  <td className="text-center py-3">Unlimited</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>

                <tr className="border-b border-stone-100">
                  <td className="py-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-forest-600" />
                    AI Coaching Sessions
                  </td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">4/month</td>
                  <td className="text-center py-3">Unlimited</td>
                </tr>

                <tr className="border-b border-stone-100">
                  <td className="py-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-forest-600" />
                    Advanced Analytics
                  </td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>

                <tr className="border-b border-stone-100">
                  <td className="py-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-forest-600" />
                    Calendar Integration
                  </td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>

                <tr className="border-b border-stone-100">
                  <td className="py-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-forest-600" />
                    Team Management
                  </td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-forest-600" />
                    Priority Support
                  </td>
                  <td className="text-center py-3">-</td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-3">
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-forest-200">
        <CardHeader>
          <CardTitle className="text-forest-800">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-forest-800 mb-2">Can I change plans anytime?</h4>
            <p className="text-stone-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-forest-800 mb-2">What happens to my data if I downgrade?</h4>
            <p className="text-stone-600 text-sm">
              Your data is always safe. If you downgrade, you'll simply lose access to premium features but keep all
              your progress.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-forest-800 mb-2">Is there a free trial for Premium?</h4>
            <p className="text-stone-600 text-sm">
              Yes! New users get a 7-day free trial of Premium features. No credit card required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
