import { 
  AbstractNotificationProviderService,
  MedusaError
} from "@medusajs/framework/utils"

import { 
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"

import { 
  Resend,
  CreateEmailOptions,
} from "resend"

import { orderPlacedEmail } from "./emails/order-placed"


type ResendOptions = {
  api_key: string
  from: string
  html_templates?: Record<string, {
    subject?: string
    content: string
  }>
}

type InjectedDependencies = {
  logger: Logger
}

enum Templates  {
  PASSWORD_RESET = "password_reset",
  ORDER_PLACED = "order-placed",
  SHIPPING_UPDATE = "shipping_update",
  NEWSLETTER = "newsletter"
}

const templates: {[key in Templates]?: (props: unknown) => React.ReactNode} = {
  [Templates.PASSWORD_RESET]: () => "<p>Click <a href='{{reset_link}}'>here</a> to reset your password.</p>",
  [Templates.ORDER_PLACED]: orderPlacedEmail,
  [Templates.SHIPPING_UPDATE]: () => "<p>Your order {{order_number}} has been shipped. Track it <a href='{{tracking_link}}'>here</a>.</p>",
  [Templates.NEWSLETTER]: () => "<p>Welcome to our newsletter! Stay tuned for updates.</p>",
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"
  private resendClient: Resend
  private options: ResendOptions
  private logger: Logger

  // ...

  constructor(
    { logger }: InjectedDependencies,
    options: ResendOptions
  ){
    super()
    this.logger = logger
    this.options = options
    this.resendClient = new Resend(this.options.api_key)
  }

  static validateOptions(options: Record<any,any>){
    if (!options.api_key){
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Resend provider requires an api_key")
    }

    if (!options.from){
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Resend provider requires a from email address")
    }
  }

  getTemplate(template: Templates){
    if (this.options.html_templates?.[template]){
      return this.options.html_templates[template].content
    }

    const allowedTemplate = Object.keys(templates)

    if(!allowedTemplate.includes(template)){
      return null
    }
    return templates[template]
  }
  
  getTemplateSubject(template: Templates){
    if (this.options.html_templates?.[template]?.subject){
      return this.options.html_templates[template].subject
    }

    switch(template){
      case Templates.PASSWORD_RESET:
        return "Reset your password"
      case Templates.ORDER_PLACED:
        return "Your order confirmation"
      case Templates.SHIPPING_UPDATE:
        return "Your shipping update"
      case Templates.NEWSLETTER:
        return "Our latest news"
      default:
        return "Notification"
    }
  }

 async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {

    const template = this.getTemplate(notification.template as Templates)

    if (!template){
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Template ${notification.template} not found`)
    }

    const commonOptions = {
      from: this.options.from,
      to: notification.to,
      subject: this.getTemplateSubject(notification.template as Templates),
    }

    let emailOptions: CreateEmailOptions

    if (typeof template === "string"){
      emailOptions = {
        ...commonOptions,
        html: template,
      }
    } else {
      emailOptions = {
        ...commonOptions,
        react: template(notification.data),
      }
    }

    const { data, error } = await this.resendClient.emails.send(emailOptions)

    if (error || !data){
      if (error){
        this.logger.error(`Resend provider failed to send email: ${error.message}`)
      } else {
        this.logger.error(`Resend provider failed to send email: Unknown error`)
      }

      return {}
    }
    return {id: data.id}
  }
}

export default ResendNotificationProviderService