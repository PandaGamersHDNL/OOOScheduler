using Microsoft.Graph;
using Microsoft.Graph.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dlwr.OOOScheduler.Services
{
    public static class TimeService
    {
        /// <summary>
        /// checks if 1 overlaps range 2
        /// </summary>
        /// <param name="start1"></param>
        /// <param name="end1"></param>
        /// <param name="start2"></param>
        /// <param name="end2"></param>
        /// <returns>bool if in range</returns>
        public static bool RangeInRange(DateTimeTimeZone start1, DateTimeTimeZone end1 , DateTime start2, DateTime end2)
        {
            Console.WriteLine(end1.TimeZone.ToString());
            Console.WriteLine("start date range");
            if (end1.ToDateTime() < start2)
            {
                Console.WriteLine("data end > start");
                return false;
            }
            Console.WriteLine("between fut/past date range");

            if (start1.ToDateTime() > end2)
            {
                Console.WriteLine("data start > end");

                return false;
            }

            Console.WriteLine("end date range true");

            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="start1"></param> start of range
        /// <param name="end1"></param> end of range
        /// <param name="toCheck"></param>
        /// <returns></returns>
        public static bool DateInRange(DateTimeTimeZone start1, DateTimeTimeZone end1, DateTime toCheck)
        {
            Console.WriteLine(end1.TimeZone.ToString());
            Console.WriteLine("start date range");
            if (end1.ToDateTime() < toCheck)
            {
                Console.WriteLine("data end > start");
                return false;
            }
            Console.WriteLine("between fut/past date range");

            if (start1.ToDateTime() > toCheck)
            {
                Console.WriteLine("data start > end");

                return false;
            }

            Console.WriteLine("end date range true");

            return true;
        }

    }
}
