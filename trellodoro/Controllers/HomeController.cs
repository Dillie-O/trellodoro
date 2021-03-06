﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace trellodoro.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Title = "Home";
			return View();
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Support()
		{
			ViewBag.Message = "Your support page.";

			return View();
		}

		public ActionResult ChangeLog()
		{
			ViewBag.Message = "ChangeLog";

			return View();
		}
	}
}