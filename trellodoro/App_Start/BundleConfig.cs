using System.Web;
using System.Web.Optimization;

namespace trellodoro
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            #region Foundation Bundles

            bundles.Add(Foundation.Styles());

            bundles.Add(Foundation.Scripts());

            #endregion

			   bundles.Add(new ScriptBundle("~/bundles/scripts/trellodoro").Include(
								"~/Scripts/moment*",
								"~/Scripts/functions.js",
								"~/Scripts/app.js"));

				bundles.Add(new StyleBundle("~/bundles/styles/trellodoro").Include(
								 "~/Content/app.css"));
        }
    }
}