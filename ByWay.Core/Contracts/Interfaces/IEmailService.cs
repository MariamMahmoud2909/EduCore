namespace ByWay.Core.Contracts.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string email, string firstName);
        Task SendPurchaseConfirmationEmailAsync(string email, string firstName, List<string> courseNames);
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    }

}
