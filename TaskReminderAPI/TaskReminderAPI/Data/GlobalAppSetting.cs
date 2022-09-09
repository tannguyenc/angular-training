namespace TaskReminderAPI.Data
{
    public class GlobalAppSetting
    {
		public APIOption APISetting { get; set; }

        public class APIOption
		{
			public string UrlSite { get; set; }
			public string ClientId { get; set; }
            public string ClientSecret { get; set; }
            public string APIKey { get; set; }
        }
    }
}
